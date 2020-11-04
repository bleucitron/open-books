<script lang="ts">
  import { onMount } from 'svelte';

  import city from '../../../stores/city';
  import { getNomen } from '../../../api';
  import {
    formatValue,
    makeFonctionTree as _makeFonctionTree,
  } from '../../../utils';
  import Spinner from '../../_components/Spinner.svelte';
  import Csv from '../_components/Csv.svelte';

  import type { Budget, FonctionTree } from '../../../interfaces';

  export let budgetP: Promise<Budget | null>;
  export let year: number;

  let makeFonctionTree: (s: string) => FonctionTree;
  let nomenCode: string;
  const fonctionTreeByCode = {};

  onMount(async () => {
    makeFonctionTree = _makeFonctionTree; // to make sure _makeFonctionTree is not called for ssr
  });

  async function getFonctionTree(
    year: number,
    code: string,
    population?: number,
  ) {
    let tree = fonctionTreeByCode[code];

    if (!tree) {
      const nomen = await getNomen(year, code, population);
      tree = makeFonctionTree?.(nomen);
      fonctionTreeByCode[code] = tree;
    }

    return tree;
  }

  $: budgetP.then(async budget => {
    if (budget) {
      const { year, nomen: code } = budget;
      nomenCode = code;

      fonctionTreeByCode[nomenCode] = getFonctionTree(
        year,
        code,
        $city?.population,
      );
    }
  });
  $: console.log('TREE', fonctionTreeByCode[nomenCode]);
</script>

<div class="Summary">
  <header>
    <h3>
      {year}
      {#await budgetP then budget}
        {#if budget}
          <Csv data={budget} />
        {/if}
      {/await}
    </h3>
    {#await budgetP then budget}
      {#if budget}
        <div class="nomen">{budget.nomen}</div>
      {/if}
    {/await}
  </header>
  {#await budgetP}
    <Spinner color={'#333'} size={'3'} />
  {:then budget}
    {#if !budget}
      <div class="values none">Aucun budget</div>
    {:else}
      <div class="values">
        <div class="value credit">
          <h4>Recettes</h4>
          {formatValue(budget.credit)}
        </div>
        <div class="value debit">
          <h4>Dépenses</h4>
          {formatValue(budget.debit)}
        </div>
      </div>
    {/if}
  {/await}
</div>

<style lang="scss">
  .Summary {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    background: white;
  }

  .values {
    flex: 1 0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .value {
    text-align: center;
    width: 40%;
    margin: 0 1rem;
    font-size: 4rem;
  }

  h3 {
    margin: 0.5rem;
    margin-bottom: 0;
    font-size: 2.5rem;
    text-align: center;
    position: relative;
  }

  h4 {
    font-size: 1.5rem;
  }

  .nomen {
    text-align: center;
  }

  .none {
    font-size: 1.5rem;
    text-align: center;
  }
</style>
