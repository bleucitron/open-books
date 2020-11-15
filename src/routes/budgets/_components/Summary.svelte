<script lang="ts">
  import { onMount } from 'svelte';

  import city from '../../../stores/city';
  import { getNomen } from '../../../api';
  import {
    typeToLabel,
    makeFonctionTree as _makeFonctionTree,
    stepsFromString,
    fonctionFromTree,
    BudgetType,
  } from '../../../utils';
  import Spinner from '../../_components/Spinner.svelte';
  import Csv from '../_components/Csv.svelte';
  import type { Type, Code, Budget, FonctionTree } from '../../../interfaces';

  import Path from './Path.svelte';
  import DebitOrCredit from './DebitOrCredit.svelte';
  import ChartManager from './ChartManager.svelte';

  export let budgetP: Promise<Budget | null>;
  export let year: number;
  let type: Type = BudgetType.DEBIT;
  let code: Code = '3';
  let tree: FonctionTree;
  let steps: { label: string; select: () => void }[];

  let makeFonctionTree: (s: string) => FonctionTree;
  const fonctionTreeByNomen = {};

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
    let tree = fonctionTreeByNomen[code];

    if (!tree) {
      const nomen = await getNomen(year, code, population);
      tree = makeFonctionTree?.(nomen);
      fonctionTreeByNomen[code] = tree;
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
  $: steps = type
    ? [{ label: typeToLabel[type], select: () => selectType(type) }, ...steps]
    : [];
</script>

<div class="summary">
  <header>
    <h3 class:clickable={steps.length > 0} on:click={reset}>{year}</h3>
    {#if tree}
      <Path {steps} />
    {/if}
    {#await budgetP then budget}
      {#if budget}
        <Csv data={budget} />
      {/if}
    {/await}
  </header>
  {#await budgetP}
    <Spinner color={'#333'} size={'3'} />
  {:then budget}
    {#if !budget}
      <div class="values none">Aucun budget</div>
    {:else if !type}
      <DebitOrCredit
        credit={budget.credit}
        debit={budget.debit}
        select={selectType}
      />
    {:else if tree}
      <ChartManager {budget} {type} {tree} {code} {selectCode} />
    {/if}
  {/await}
  {#await budgetP then budget}
    {#if budget}
      <div class="nomen">{budget.nomen}</div>
    {/if}
  {/await}
</div>

<style lang="scss">
  .summary {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: stretch;
    padding: 0.5rem;
    width: 100%;
    background: white;
    overflow: hidden;
  }

  :global(.summary .path) {
    margin-left: 0.5rem;
  }

  header {
    position: relative;
    display: flex;
    align-items: baseline;
  }

  h3 {
    margin-left: 0.5rem;
    font-size: 3.5rem;

    &.clickable:hover {
      cursor: pointer;
      color: coral;
    }
  }

  .nomen {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    font-size: 0.9rem;
    padding: 0.2rem;
    background: grey;
    color: white;
    border-radius: 4px;
  }

  .none {
    font-size: 1.5rem;
    text-align: center;
  }
</style>
