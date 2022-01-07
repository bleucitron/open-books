<script lang="ts" context="module">
  import { fillBudgetBySiret, fillBudgetBySirens } from './cache';
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';
  import { getSiretsFromInsee, getCity } from '@api';
  import { extractSirens } from '@api/utils/siren';

  const start = 2012;
  const end = new Date().getFullYear();
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export async function load({
    page: { query },
  }: LoadInput): Promise<LoadOutput> {
    const name = query.get('name');
    const insee = query.get('insee');
    const y = query.get('year');
    const sirenString = query.get('sirens');
    let siret = query.get('siret');

    let sirens = sirenString?.split(',');

    const year = parseInt(y) || defaultYear;

    if (!siret || !sirens) {
      const siretsFromInsee = await getSiretsFromInsee(name, insee);
      sirens = extractSirens(siretsFromInsee);

      const sirets = siretsFromInsee
        .filter(e => e.etablissementSiege)
        .map(e => e.siret)
        .sort();

      siret = sirets[0];

      return {
        redirect: makeBudgetUrl({
          name,
          insee,
          siret,
          sirens,
          year,
        }),
        status: 301,
      };
    }

    return {
      props: {
        sirens,
        currentSiret: siret,
        currentYear: year,
        insee,
        name,
      },
    };
  }
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import city from '@stores/city';
  import { history } from '@stores/history';
  import { makeId, makeBudgetUrl } from '@utils';

  import type { Budget, BudgetMap, City, HistorySearch } from '@interfaces';

  import Icon from '$lib/Icon.svelte';
  import Spinner from '$lib/Spinner.svelte';
  import Labels from './_components/Labels.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';
  import History from '$lib/History.svelte';
  import { browser } from '$app/env';

  export let sirens: string[];
  export let currentSiret: string;
  export let currentYear: number;
  export let insee: string;
  export let name: string;
  // let type: string;
  // let fonction: string;

  let budgetById: BudgetMap = {};

  $: if ($city) budgetById = {};

  $: if (browser) {
    const sirensList = $page.query.get('sirens').split(',');
    const newHistoryItem: HistorySearch = {
      name: $page.query.get('name'),
      insee: $page.query.get('insee'),
      sirens: sirensList,
    };

    history.addItem(newHistoryItem);
  }

  function selectSiret(s: string): void {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: s,
      sirens,
      year: currentYear,
    });

    goto(url);
  }

  function selectYear(y: number): void {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: currentSiret,
      sirens,
      year: y,
    });

    goto(url);
  }

  $: findSimilarBudget = function (siret: string) {
    return Object.values(budgetById).find(
      budget => budget && budget.siret === siret,
    );
  };

  $: findSimilarLabel = function () {
    const id = makeId(currentSiret, currentYear);
    const budget = budgetById[id] || findSimilarBudget(currentSiret);
    return budget?.label;
  };

  $: cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then((result: City) => {
        city.set(result);
        return result;
      });

  $: budgetPs = fillBudgetBySiret(currentSiret, years, name).map(p =>
    p.then(b => b && (budgetById[b.id] = b)),
  );
  $: otherBudgetPs = fillBudgetBySirens(sirens, [...years].reverse(), name).map(
    p => p.then(budgets => budgets.map(b => b && (budgetById[b.id] = b))),
  );

  $: allPs = [...budgetPs, ...otherBudgetPs] as Promise<unknown>[];

  $: loadingP = Promise.all(allPs);

  $: sirets = [
    ...new Set(
      Object.values(budgetById)
        .filter(b => b)
        .map((b: Budget) => b.siret),
    ),
  ].sort();

  $: labels = sirets
    .map(s => {
      const id = makeId(s, currentYear);
      const budget = budgetById[id];

      return budget || findSimilarBudget(s);
    })
    .filter(l => l) as Budget[];

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.obnetcre),
  );

  $: yearIndex = years.findIndex(y => y === currentYear);
  $: budgetP = budgetPs[yearIndex];
  $: label = findSimilarLabel();
</script>

<svelte:head>
  {#await cityP}
    <title>{`Budgets pour ${name}`}</title>
  {:then city}
    {#if city}
      <title>{`Budgets pour ${name} (${city.departement.code})`}</title>
    {/if}
  {:catch}
    <title>{`Budgets pour ${name}`}</title>
  {/await}
</svelte:head>

<header>
  <a class="home" href="/">
    <Icon id="book-open" />
  </a>
  <div class="info-container">
    <div class="titles">
      <h1>{name}</h1>

      {#if label}
        <h2>{label}</h2>
      {/if}
    </div>
    <div class="info">
      {#await cityP}
        <Spinner />
      {:then city}
        {#if city}
          <span>{`Population : ${city.population}`}</span>
          |
          <span>{`${city.departement.code} - ${city.departement.nom}`}</span>
        {/if}
      {:catch error}
        <div style="color: red">{error}</div>
      {/await}
    </div>
  </div>
  <History />
</header>

<div class="content">
  <menu>
    <Labels {labels} {loadingP} selected={currentSiret} select={selectSiret} />
  </menu>
  <div class="dataviz">
    <Years {years} {valuePs} selected={currentYear} select={selectYear} />
    <Summary year={currentYear} {budgetP} />
  </div>
</div>

<style lang="scss">
  header {
    padding: 0 0.5rem;
    min-height: 3rem;
    background: #151515;
    color: white;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info-container {
      flex: 1 0;
      display: flex;
      flex-direction: column;
    }

    .home {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 1.5rem;
      margin-right: 1.5rem;
      color: #444;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: coral;
      }
    }

    .titles {
      display: flex;
      align-items: baseline;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.2rem;
      margin-left: 1rem;
      text-transform: capitalize;
    }

    .info {
      margin: 0;
      display: flex;
      align-items: flex-end;
      opacity: 0.3;

      span:first-child {
        margin-right: 3px;
      }

      span:last-child {
        margin-left: 3px;
      }
    }
  }

  menu {
    margin: 0;
    color: white;
    background: #333;
    display: flex;
    padding: 1rem;
    padding-right: 1.5rem;
  }

  .content {
    flex: 1 0;
    display: flex;
    flex-flow: row;
    overflow: hidden;
  }

  .dataviz {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: #333;
  }
</style>
