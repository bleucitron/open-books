<script lang="ts" context="module">
  import { get } from 'svelte/store';
  import type { Load } from '@sveltejs/kit';
  import { getSiretsFromInsee, getCity } from '@api';
  import { extractSirens } from '@api/utils/siren';
  import { type, code } from '@stores';
  import city from '@stores/city';
  import { formatValue } from '@utils/misc';
  import FavoriteToggle from '$lib/FavoriteToggle.svelte';
  import FavoriteMenu from '$lib/FavoriteMenu.svelte';
  import { fillBudget, fillBudgetBySirens } from './_cache';

  const start = 2012;
  const end = new Date().getFullYear() - 1;
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export const load: Load = async ({ url: { searchParams }, fetch }) => {
    const insee = searchParams.get('insee');
    const y = searchParams.get('year');
    const sirenString = searchParams.get('sirens');
    let siret = searchParams.get('siret');

    let sirens = sirenString?.split(',');

    let $city = get(city);

    if (!$city || $city.code !== insee) {
      $city = await getCity(insee, fetch);
    }

    const year = parseInt(y) || defaultYear;

    if (!siret || !sirens) {
      const siretsFromInsee = await getSiretsFromInsee(insee, fetch);
      const mainSirets = siretsFromInsee.filter(e => e.etablissementSiege);
      sirens = extractSirens(mainSirets);

      const sirets = mainSirets.map(e => e.siret).sort();

      siret = sirets[0];

      return {
        redirect: makeBudgetUrl({
          insee,
          siret,
          sirens,
          year,
        }),
        status: 302,
      };
    }

    const budget = await fillBudget(siret, year, $city);

    return {
      props: {
        sirens,
        currentCity: $city,
        currentSiret: siret,
        currentYear: year,
        insee,
        budget,
      },
    };
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import history from '@stores/history';
  import { makeId, makeBudgetUrl, fonctionFromTree } from '@utils';

  import type { Budget, BudgetMap, City } from '@interfaces';

  import Icon from '$lib/Icon.svelte';
  import Search from '$lib/Search.svelte';
  import HistoryMenu from '$lib/HistoryMenu.svelte';
  import Labels from './_components/Labels.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';

  export let sirens: string[];
  export let currentSiret: string;
  export let currentCity: City;
  export let currentYear: number;
  export let insee: string;
  export let budget: Budget;

  let budgetById: BudgetMap = {};

  $: if (budget) {
    budgetById[budget?.id] = budget;
  }
  $: if (insee) {
    budgetById = {};
    city.set(currentCity);
  }

  $: if ($page) {
    history.addItem({
      name: $city.nom,
      insee,
      sirens,
    });
  }

  function selectSiret(s: string): void {
    const url = new URL($page.url);
    url.searchParams.set('siret', s);
    url.searchParams.set('year', currentYear.toString());

    goto(url.href);
  }

  function selectYear(y: number): void {
    const url = new URL($page.url);
    url.searchParams.set('siret', currentSiret);
    url.searchParams.set('year', y.toString());

    goto(url.href);
  }

  function handleSearch({ detail }: CustomEvent): void {
    const {
      city: { code },
      siret,
    } = detail;

    let url = `/budgets?insee=${code}`;
    if (siret) url += `&siret=${siret}`;

    goto(url);
  }

  $: findSimilarBudget = function (siret: string) {
    return Object.values(budgetById).find(
      budget => budget && budget.siret === siret,
    );
  };

  $: ({ nom, departement, population } = $city);

  $: budgetPs = years
    .map(year =>
      year === currentYear
        ? Promise.resolve(budget)
        : fillBudget(currentSiret, year, $city),
    )
    .map(p => p.then(b => b && (budgetById[b.id] = b)));

  $: otherBudgetPs = browser
    ? fillBudgetBySirens(sirens, [...years].reverse(), $city).map(p =>
        p.then(budgets =>
          budgets.map(b => b && b.cityCode === insee && (budgetById[b.id] = b)),
        ),
      )
    : [];

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
    budgetP.then(budget => {
      if (!budget) return null;

      const source = $code ? fonctionFromTree($code, budget.tree) : budget;

      return $type ? source?.value[$type] : 0;
    }),
  );
</script>

<svelte:head>
  <title>{`Budgets pour ${nom} (${departement.code})`}</title>
</svelte:head>

<header>
  <div>
    <a class="home" href="/">
      <Icon id="book-open" />
    </a>
    <div class="info-container">
      <div class="titles">
        <FavoriteToggle name={nom} {insee} {sirens} />
        <h1>{nom}</h1>
        <div class="info">
          <span>{formatValue(population)} habitants</span>
          <span>
            ({nom} - {departement.code})
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="actions">
    <Search on:select={handleSearch} />
    <HistoryMenu />
    <FavoriteMenu />
  </div>
</header>

<div class="content">
  <menu>
    <Labels {labels} {loadingP} selected={currentSiret} select={selectSiret} />
  </menu>
  <div class="dataviz">
    <Summary year={currentYear} {budget} />
    <Years {years} {valuePs} selected={currentYear} select={selectYear} />
  </div>
</div>

<style lang="sass">
  header
    position: relative
    display: flex
    justify-content: space-between
    padding: 0 1rem
    height: $headerHeight
    background: $grey-darkest
    color: $grey-dark

    > div
      display: flex
      align-items: center

      &:first-child
        flex: 1

      :global
        .Search
          width: 30rem
          height: 100%
          font-size: 1rem

          :global(.Icon)
            font-size: 1rem
            margin: 0.8rem

        .search-input
          font-size: 1rem
          height: 100%

          &::placeholder
            color: $grey-dark

          &:focus::placeholder
            color: $grey

        .searchbar
          height: 100%
          background: $grey-darker
          border-radius: 0
          font-size: 1.1rem

          &:focus-within
            background: $grey-dark


        .Suggestion
          font-size: 1em

    .actions
      gap: 1rem

    .info-container
      display: flex
      flex-direction: column

    .home
      display: flex
      align-items: center
      height: 100%
      font-size: 1.5rem
      margin-right: 1.2rem
      transition: color 0.3s ease-in-out

      &:hover
        color: coral

    .titles
      display: flex
      align-items: baseline
      gap: 0.5rem

    h1
      font-size: 2rem
      color: $grey-lightest

    .info
      margin: 0
      display: flex
      align-items: flex-end

      span:first-child
        margin-right: 3px

      span:last-child
        margin-left: 3px

  menu
    margin: 0
    color: white
    background: $grey-darker
    display: flex
    padding: 1rem
    padding-right: 1.5rem

  .content
    display: flex
    flex-flow: row
    height: calc(100vh - $headerHeight)
    overflow: hidden

  .dataviz
    flex: 1 0
    display: flex
    flex-flow: column
    align-items: center
</style>
