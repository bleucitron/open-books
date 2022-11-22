<div>Coucou</div>
<!-- <script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  import { type, code, changingCity } from '@stores';
  import type { Budget, BudgetMap, City } from '@interfaces';
  import { fillBudget, fillBudgetBySirens } from './cache';

  const start = 2012;
  const end = new Date().getFullYear() - 1;
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export const load: Load = async ({ url: { searchParams }, stuff, fetch }) => {
    const insee = searchParams.get('insee');
    const y = searchParams.get('year');
    const sirenString = searchParams.get('sirens');
    const siret = searchParams.get('siret');

    const year = parseInt(y) || defaultYear;

    const city = insee && stuff.city;
    const sirens = sirenString?.split(',');

    const budget = await fillBudget(siret, year, city, fetch);

    return {
      props: {
        sirens,
        currentCity: city,
        currentSiret: siret,
        currentYear: year,
        insee,
        budget,
      },
    };
  };
</script>

<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import { makeId, fonctionFromTree } from '@utils';

  import Spinner from '$lib/Spinner.svelte';
  import Labels from './components/Labels.svelte';
  import Years from './components/Years.svelte';
  import Summary from './components/Summary.svelte';

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
  $: if (browser && insee) {
    budgetById = {};
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
        : fillBudget(currentSiret, year, currentCity),
    )
    .map(p => p.then(b => b && (budgetById[b.id] = b)));

  $: otherBudgetPs = browser
    ? fillBudgetBySirens(sirens, [...years].reverse(), currentCity).map(p =>
        p.then(budgets =>
          budgets
            .filter(b => b && b.info.city?.code === insee)
            .forEach(b => (budgetById[b.id] = b)),
        ),
      )
    : [];

  $: allPs = [...budgetPs, ...otherBudgetPs] as Promise<unknown>[];
  $: loadingP = Promise.all(allPs);
  $: Promise.all(budgetPs).then(() => {
    if (sirets.length && !sirets.includes(currentSiret)) {
      const url = new URL($page.url);
      url.searchParams.set('siret', sirets[0]);

      goto(url.href);
    }
  });

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
    <Labels {labels} {loadingP} />
  </menu>
  <div class="dataviz">
    {#if $changingCity}
      <Spinner />
    {:else}
      <Summary year={currentYear} {budget} />
      <Years {years} {valuePs} />
    {/if}
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
    height: 100%
    overflow: hidden

  .dataviz
    :global
      .Spinner
        font-size: 3rem

    flex: 1 0
    display: flex
    flex-flow: column
    align-items: center
    justify-content: center
</style> -->
