<script lang="ts" context="module">
  import { fillBudgetBySiret, fillBudgetBySirens } from './cache';
  import city from '@stores/city';
  import { get } from 'svelte/store';
  import type { Load } from '@sveltejs/kit';
  import { getSiretsFromInsee, getCity, getCities } from '@api';
  import { extractSirens } from '@api/utils/siren';
  import { extractSiren } from '@utils/misc';
  import AddFavorite from '$lib/addFavorite.svelte';
  import Favorite from '$lib/Favorite.svelte';

  const start = 2012;
  const end = new Date().getFullYear();
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export const load: Load = async ({ url: { searchParams }, fetch }) => {
    const name = searchParams.get('name');
    const insee = searchParams.get('insee');
    const y = searchParams.get('year');
    const sirenString = searchParams.get('sirens');
    let siret = searchParams.get('siret');

    let sirens = sirenString?.split(',');

    const $city = get(city);

    if ($city === undefined) {
      const cities = await getCities(name, fetch);
      city.set(cities[0]);
    }

    const year = parseInt(y) || defaultYear;

    if (!siret || !sirens) {
      const siretsFromInsee = await getSiretsFromInsee(name, insee, fetch);
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

    const mainSiren = extractSiren(siret);
    await Promise.all(fillBudgetBySirens([mainSiren], [year], $city));
    return {
      props: {
        sirens,
        currentSiret: siret,
        currentYear: year,
        insee,
        name,
      },
    };
  };
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import { history } from '@stores/history';
  import { budget } from '@stores';
  import { makeId, makeBudgetUrl } from '@utils';

  import type { Budget, BudgetMap, City, HistorySearch } from '@interfaces';

  import Icon from '$lib/Icon.svelte';
  import Search from '$lib/Search.svelte';
  import Spinner from '$lib/Spinner.svelte';
  import History from '$lib/History.svelte';
  import Labels from './_components/Labels.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';

  export let sirens: string[];
  export let currentSiret: string;
  export let currentYear: number;
  export let insee: string;
  export let name: string;
  // let type: string;
  // let fonction: string;

  let budgetById: BudgetMap = {};

  $: if (name) {
    budgetById = {};
  }

  $: if ($page) {
    const { searchParams } = $page.url;
    const sirensList = searchParams.get('sirens').split(',');
    const newHistoryItem: HistorySearch = {
      name: searchParams.get('name'),
      insee: searchParams.get('insee'),
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

  function handleSearch({ detail }: CustomEvent): void {
    const { nom, code } = detail.city;
    const { siret } = detail;

    let url = `/budgets?name=${nom}&insee=${code}`;
    if (siret) url += `&siret=${siret}`;

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

  $: budgetPs = fillBudgetBySiret(currentSiret, years, $city).map(p =>
    p.then(b => b && (budgetById[b.id] = b)),
  );
  $: otherBudgetPs = fillBudgetBySirens(
    sirens,
    [...years].reverse(),
    $city,
  ).map(p =>
    p.then(budgets =>
      budgets.map(async _b => {
        const b = await _b;
        return b && (budgetById[b.id] = b);
      }),
    ),
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
    budgetP.then(budget => budget && budget.value.obnetcre),
  );

  $: budgetP = budgetPs[yearIndex];
  $: budgetP.then(b => ($budget = b));

  $: yearIndex = years.findIndex(y => y === currentYear);
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
  <div>
    <a class="home" href="/">
      <Icon id="book-open" />
    </a>
    <div class="info-container">
      <div class="titles">
        <AddFavorite {name} {insee} {sirens} />
        <h1>{name}</h1>
        <div class="info">
          {#await cityP}
            <Spinner />
          {:then { population, departement: { code, nom } }}
            {#if city}
              <span>{population} habitants</span>
              <span>
                ({nom} - {code})
              </span>
            {/if}
          {:catch error}
            <div style="color: red">{error}</div>
          {/await}
        </div>
        {#if label}
          <h2>{label}</h2>
        {/if}
      </div>
    </div>
  </div>
  <div class="actions">
    <Search on:select={handleSearch} />
    <History />
    <Favorite />
  </div>
</header>

<div class="content">
  <menu>
    <Labels {labels} {loadingP} selected={currentSiret} select={selectSiret} />
  </menu>
  <div class="dataviz">
    <Summary year={currentYear} {budgetP} />
    <Years {years} {valuePs} selected={currentYear} select={selectYear} />
  </div>
</div>

<style lang="scss">
  header {
    padding: 0 0.7rem;
    min-height: 3rem;
    background: #151515;
    color: white;

    position: relative;
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;

      &:first-child {
        flex: 1;
      }

      :global {
        .Search {
          width: 30rem;
          height: 100%;
          font-size: 1rem;

          :global(.Icon) {
            font-size: 1rem;
            margin: 0.8rem;
          }
        }
        .search-input {
          font-size: 1rem;
          height: 100%;

          &::placeholder {
            color: #666;
          }

          &:focus::placeholder {
            color: #888;
          }
        }

        .searchbar {
          height: 100%;
          background: #252525;
          border-radius: 0;
          font-size: 1.1rem;
        }
        .searchbar:focus-within {
          background: #454545;
        }

        .Suggestion {
          font-size: 1em;
        }
      }
    }

    .actions {
      gap: 1rem;
    }

    .info-container {
      display: flex;
      flex-direction: column;
    }
    .home {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 1.5rem;
      margin-right: 1.2rem;
      color: #444;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: coral;
      }
    }

    .titles {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.2rem;
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
  }
</style>
