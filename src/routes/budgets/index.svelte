<script lang="ts" context="module">
  import { getSiretsFromInsee, getCity } from '../../api';
  import { extractSirens } from '../../api/utils/siren';

  interface Query {
    name: string;
    insee: string;
    siret: string;
    sirens: string;
    year: string;
  }

  const start = 2012;
  const end = new Date().getFullYear();
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export async function preload(page: { query: Query }) {
    let { name, insee, siret, sirens: sirenString, year: y } = page.query;

    let sirens = sirenString?.split(',');
    let year = parseInt(y) || defaultYear;

    if (!siret || !sirens) {
      const siretsFromInsee = await getSiretsFromInsee(name, insee);

      sirens = extractSirens(siretsFromInsee);

      const sirets = siretsFromInsee
        .filter(e => e.etablissementSiege)
        .map(e => e.siret)
        .sort();

      siret = sirets[0];
    }

    return {
      sirens,
      currentSiret: siret,
      currentYear: year,
      insee,
      name,
    };
  }
</script>

<script lang="ts">
  import { goto } from '@sapper/app';

  import city from '../../stores/city';
  import { getRecords } from '../../api';
  import {
    makeBudget,
    makeId,
    makeBudgetUrl,
    orderRecordsBySiret,
  } from '../../utils';
  import Labels from './_components/Labels.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';
  import Spinner from '../_components/Spinner.svelte';

  import type { Budget, BudgetMap, City, Record } from '../../interfaces';

  export let sirens: string[];
  export let currentSiret: string;
  export let currentYear: number;
  export let insee: string;
  export let name: string;
  let type: string;
  let fonction: string;

  let budgetById: BudgetMap = {};

  function selectSiret(s: string) {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: s,
      sirens,
      year: currentYear,
    });

    goto(url);

    budgetPs = years.map(y => {
      const id = makeId(s, y);
      return Promise.resolve(budgetById[id]);
    });
  }

  function selectYear(y: number) {
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

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then((result: City) => {
        city.set(result);
        return result;
      });

  let budgetPs = years.map(year =>
    getRecords({ ident: [currentSiret], year })
      .catch(() => [])
      .then((records: Record[]) => {
        const b = makeBudget({
          city: name,
          siret: currentSiret,
          year,
          records,
        });

        const id = makeId(currentSiret, year);
        budgetById[id] = b;

        return b;
      }),
  );

  const otherBudgetPs = [...years].reverse().map(year =>
    getRecords({ siren: sirens, year })
      .catch(() => [])
      .then((records: Record[]) =>
        orderRecordsBySiret(records).map(({ siret, records }) => {
          const b = makeBudget({
            city: name,
            siret,
            year,
            records,
          });

          const id = makeId(siret, year);
          if (siret !== currentSiret) budgetById[id] = b;

          return b;
        }),
      ),
  );

  const allPs = [...budgetPs, ...otherBudgetPs] as Promise<any>[];

  const loadingP = Promise.all(allPs);

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
    budgetP.then(budget => budget && budget.credit),
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
    <i class="fas fa-book-open" />
  </a>
  <div class="info">

    <div class="labels">
      <h1>{name}</h1>

      {#if label}
        <h2>{label}</h2>
      {/if}
    </div>

    <div class="departement">
      {#await cityP}
        <Spinner />
      {:then city}
        {#if city}
          <div>{`${city.departement.code} - ${city.departement.nom}`}</div>
        {/if}
      {:catch error}
        <div style="color: red">{error}</div>
      {/await}

    </div>
  </div>
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
    height: 3rem;
    background: #151515;
    color: white;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info {
      flex: 1 0;
      display: flex;
      justify-content: space-between;
    }

    .home {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .labels {
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

    .departement {
      display: flex;
      align-items: flex-end;
      opacity: 0.3;
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
  }

  .dataviz {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: #333;
  }

  .home {
    font-size: 1.5rem;
    margin-right: 1.5rem;
    color: #444;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: coral;
    }
  }
</style>
