<script lang="ts">
  import type { LayoutData } from './$types';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Budget } from '@interfaces';
  import { type, code, changingCity } from '@stores';
  import { makeId, fonctionFromTree } from '@utils';
  import Spinner from '$lib/Spinner.svelte';
  import { fillBudget, fillBudgetBySirens } from './cache';
  import Labels from './components/Labels.svelte';
  import Years from './components/Years.svelte';

  const start = 2012;
  const end = new Date().getFullYear() - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export let data: LayoutData;

  let budgetById: Record<string, Budget | undefined> = {};

  $: ({ sirens, city } = data); // possiblement déclarer budgetById comme state

  $: ({
    params: { insee },
    url: { searchParams },
    data: { budget },
  } = $page);
  $: year = parseInt(searchParams.get('year') ?? '');
  $: siret = searchParams.get('siret') ?? '';

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
    .map(y =>
      y === year ? Promise.resolve(budget) : fillBudget(siret, y, city),
    )
    .map(p => p.then(b => b && (budgetById[b.id] = b)));

  $: otherBudgetPs = browser
    ? fillBudgetBySirens(sirens, [...years].reverse(), city).map(p =>
        p.then(budgets =>
          budgets
            .filter(b => b && b.info.city?.code === insee)
            .forEach(b => (budgetById[(b as Budget).id] = b)),
        ),
      )
    : [];

  $: allPs = [...budgetPs, ...otherBudgetPs] as Promise<unknown>[];
  $: loadingP = Promise.all(allPs);
  $: Promise.all(budgetPs).then(() => {
    if (sirets.length && !sirets.includes(siret)) {
      const url = new URL($page.url);
      url.searchParams.set('siret', sirets[0]);

      goto(url.href);
    }
  });

  $: sirets = [
    ...new Set(
      Object.values(budgetById)
        .filter(b => b)
        .map(b => (b as Budget).siret),
    ),
  ].sort();

  $: labels = sirets
    .map(s => {
      const id = makeId(s, year);
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
      <section>
        <slot />
      </section>
      <!-- <Summary year={currentYear} {budget} /> -->
      <Years {years} {valuePs} />
    {/if}
  </div>
</div>

<style lang="sass">
  .content
    display: flex
    flex-flow: row
    height: 100%
    overflow: hidden

  menu
    margin: 0
    color: white
    background: $grey-darker
    display: flex
    padding: 1rem
    padding-right: 0

  section
    flex: 1 0

  .dataviz
    :global
      .Spinner
        font-size: 3rem

    flex: 1 0
    display: flex
    flex-flow: column
    align-items: center
    justify-content: center
</style>
