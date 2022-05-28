<script lang="ts" context="module">
  import { get } from 'svelte/store';
  import type { Load } from '@sveltejs/kit';
  import { type, code } from '@stores';
  import city from '@stores/city';
  import type { Budget, BudgetMap, City } from '@interfaces';
  import { fillBudget, fillBudgetBySirens } from './_cache';

  const start = 2012;
  const end = new Date().getFullYear() - 1;
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export const load: Load = async ({ url: { searchParams } }) => {
    const insee = searchParams.get('insee');
    const y = searchParams.get('year');
    const sirenString = searchParams.get('sirens');
    const siret = searchParams.get('siret');

    const year = parseInt(y) || defaultYear;

    const $city = insee && get(city);
    const sirens = sirenString?.split(',');

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

  import { makeId, fonctionFromTree } from '@utils';

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
  $: if (insee || currentSiret) {
    budgetById = {};
    city.set(currentCity);
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

  $: findSimilarBudget = function (siret: string) {
    return Object.values(budgetById).find(
      budget => budget && budget.siret === siret,
    );
  };

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
          budgets
            .filter(b => b && b.info.city?.code === insee)
            .forEach(b => (budgetById[b.id] = b)),
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
  menu
    margin: 0
    color: white
    background: $grey-darker
    display: flex
    padding: 1rem
    padding-right: 0

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
