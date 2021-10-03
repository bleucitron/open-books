<script lang="ts">
  /*
    Le code se basant uniquement sur la notion de fonction,
    les opérations sans fonction n'apparaissent pas dans ce détail.

    Voir la fonction aggregateData
  */

  import { onMount } from 'svelte';

  import { city, tree, code, budget, fonction } from '../../../stores';
  import { getNomen } from '../../../api';
  import {
    typeToLabel,
    makeFonctionTree as _makeFonctionTree,
    stepsFromString,
    fonctionFromTree,
    aggregateData,
    BudgetType,
    formatValue,
  } from '../../../utils';
  import Spinner from '../../_components/Spinner.svelte';
  import Csv from '../_components/Csv.svelte';
  import type {
    Type,
    Code,
    Budget,
    FonctionTree,
    FonctionTreeValue,
  } from '../../../interfaces';

  import Path from './Path.svelte';
  import DebitOrCredit from './DebitOrCredit.svelte';
  import Chart from './Chart.svelte';

  export let budgetP: Promise<Budget>;
  export let year: number;
  let type: Type = BudgetType.DEBIT;
  let steps: { label: string; select: () => void }[];

  let makeFonctionTree: (s: string) => FonctionTree;
  const fonctionTreeByNomen = {};

  onMount(async () => {
    makeFonctionTree = _makeFonctionTree; // to make sure _makeFonctionTree is not called for ssr
  });

  function selectType(t: Type) {
    type = t;
    code.set(undefined);
  }
  function selectCode(c: Code) {
    code.set(c);
  }

  function reset() {
    type = undefined;
    code.set(undefined);
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

  $: budgetP.then(async b => {
    if (b) {
      const { year, nomen: code } = b;
      budget.set(b);

      const _tree = await getFonctionTree(year, code, $city?.population);

      const aggTree = _tree && aggregateData(b.records, _tree);
      tree.set(aggTree);
    }
  });

  $: steps =
    $code && $tree
      ? stepsFromString($code as string).map(code => {
          const fonction = fonctionFromTree(code, $tree as FonctionTree);
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

  $: fonctions =
    $tree &&
    (Object.values(
      $fonction ? $fonction.subTree : $tree,
    ) as FonctionTreeValue[]);

  $: values = fonctions
    ?.map((f: FonctionTreeValue) => ({
      label: f.label,
      value: f[type as BudgetType],
      handleClick: f.subTree && (() => selectCode(f.code)),
    }))
    .sort((a, b) => b.value - a.value);

  $: infosP = budgetP.then(budget => {
    if (budget) {
      const main = type && ($fonction ? $fonction[type] : budget[type]);

      return {
        debit: budget.obnetdeb,
        credit: budget.obnetcre,
        nomen: budget.nomen,
        main,
      };
    }
  });
</script>

<div class="summary">
  <header>
    <h3 class:clickable={steps.length > 0} on:click={reset}>{year}</h3>
    {#if $tree}
      <Path {steps} />
    {/if}
    {#await budgetP then budget}
      {#if budget}
        <Csv data={budget} />
      {/if}
    {/await}
  </header>
  <div class="values">
    {#await infosP}
      <Spinner color="#333" size={3} />
    {:then infos}
      {#if !infos}
        <div class="none">Aucun budget</div>
      {:else if !type}
        <DebitOrCredit
          credit={infos.credit}
          debit={infos.debit}
          select={selectType}
        />
      {:else if values}
        <div class="main">{formatValue(infos.main)}</div>
        <Chart {values} />
      {/if}
      {#if infos}
        <div class="nomen">{infos.nomen}</div>
      {/if}
    {/await}
  </div>
</div>

<style lang="scss">
  .summary {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: stretch;
    padding: 1rem;
    width: 100%;
    background: white;
    overflow: hidden;
  }

  :global(.summary .path) {
    margin-left: 1rem;
  }

  header {
    position: relative;
    display: flex;
    align-items: baseline;

    h3 {
      margin-left: 0.5rem;
      font-size: 3.5rem;

      &.clickable:hover {
        cursor: pointer;
        color: coral;
      }
    }
  }

  .values {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
    overflow-y: hidden;

    .none {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      text-align: center;
    }

    .main {
      font-size: 3rem;
    }

    .nomen {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      font-size: 0.9rem;
      padding: 0.2rem;
      background: grey;
      color: white;
      border-radius: 4px;
    }
  }
</style>
