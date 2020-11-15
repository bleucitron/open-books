<script lang="ts">
  /*
    Le code se basant uniquement sur la notion de fonction,
    les opérations sans fonction n'apparaissent pas dans ce détail
  */

  import Chart from './Chart.svelte';
  import type {
    Budget,
    FonctionTree,
    FonctionTreeValue,
    Type,
    Code,
  } from '../../../interfaces';
  import { aggregateData, fonctionFromTree, BudgetType } from '../../../utils';

  export let budget: Budget;
  export let tree: FonctionTree;
  export let type: Type;
  export let code: Code;
  export let selectCode: (c: Code) => void;

  $: aggTree = aggregateData(budget.records, tree);
  $: fonction = code && fonctionFromTree(code, aggTree);
  $: fonctions = Object.values(fonction ? fonction.subTree : aggTree);

  $: values = fonctions
    ?.map((f: FonctionTreeValue) => ({
      code: f.code,
      label: f.label,
      value: f[type as BudgetType],
      clickable: !!f.subTree,
    }))
    .sort((a, b) => b.value - a.value);
</script>

<div class="chart-manager">
  <Chart {selectCode} {values} />
</div>

<style>
  .chart-manager {
    flex: 1 0;
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>
