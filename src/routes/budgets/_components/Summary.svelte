<script lang="ts">
  import { onMount } from 'svelte';

  import city from '../../../stores/city';
  import { getNomen } from '../../../api';
  import {
    BudgetType,
    formatValue,
    typeToLabel,
    makeFonctionTree as _makeFonctionTree,
    stepsFromString,
    fonctionFromTree,
  } from '../../../utils';
  import Spinner from '../../_components/Spinner.svelte';
  import Csv from '../_components/Csv.svelte';
  import type { Type, Code, Budget, FonctionTree } from '../../../interfaces';

  import Path from './Path.svelte';
  import ChartManager from './ChartManager.svelte';

  export let budgetP: Promise<Budget | null>;
  export let year: number;
  let type: Type;
  let code: Code;
  let tree: FonctionTree;

  let makeFonctionTree: (s: string) => FonctionTree;
  const fonctionTreeByCode = {};

  onMount(async () => {
    makeFonctionTree = _makeFonctionTree; // to make sure _makeFonctionTree is not called for ssr
  });

  function selectType(t: Type) {
    type = t;
    code = undefined;
  }
  function selectCode(f: Code) {
    code = f;
  }

  function reset() {
    type = undefined;
    code = undefined;
  }

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

  $: treeP = budgetP.then(async budget => {
    if (budget) {
      const { year, nomen: code } = budget;
      const _tree = await getFonctionTree(year, code, $city?.population);
      tree = _tree;
      return _tree;
    }
  });

  $: steps =
    code && tree
      ? stepsFromString(code).map(code => {
          const fonction = fonctionFromTree(code, tree);
          const { short, label } = fonction;

          return {
            label: short || label,
            select: () => selectCode(code),
          };
        })
      : [];
  $: {
    if (type)
      steps = [
        { label: typeToLabel[type], select: () => selectType(type) },
        ...steps,
      ];
  }
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
    {:else if !type}
      <div class="values">
        <div
          class="value credit"
          on:click={() => selectType(BudgetType.CREDIT)}
        >
          <h4>Recettes</h4>
          {formatValue(budget.credit)}
        </div>
        <div class="value debit" on:click={() => selectType(BudgetType.DEBIT)}>
          <h4>Dépenses</h4>
          {formatValue(budget.debit)}
        </div>
      </div>
    {:else if tree}
      <Path {steps} {reset} />
      <ChartManager {budget} {type} {tree} {code} {selectCode} />
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

  h4 {
    font-size: 1.5rem;
  }

  h3 {
    margin: 0.5rem;
    margin-bottom: 0;
    font-size: 2.5rem;
    text-align: center;
    position: relative;
  }

  .nomen {
    text-align: center;
  }

  .none {
    font-size: 1.5rem;
    text-align: center;
  }
</style>
