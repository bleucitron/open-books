<script lang="ts">
  import Bar from './Bar.svelte';
  import type { BarChartValue } from '@interfaces';
  import type { BudgetType } from '@utils';

  export let currentTree: BarChartValue[] = [];
  export let type: BudgetType;

  currentTree.sort((a, b) => {
    return b.value[type] - a.value[type];
  });

  const total = currentTree
    .map(value => {
      return value.value[type];
    })
    .reduce((partialSum, a) => partialSum + a, 0);

  function handleClick(subTree: BarChartValue[]): void {
    currentTree = Object.values(subTree);
  }
</script>

<div class="budgetHisto">
  {#each currentTree as { label, value, subTree }}
    <Bar
      {label}
      value={value[type]}
      percentage={value[type] / total}
      width={value[type] / total}
      clickable={subTree !== undefined}
      handleClick={() => handleClick(subTree)}
    />
  {/each}
</div>

<style lang="scss">
  .budgetHisto {
    flex: 1 0;
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    width: 70%;
    max-width: 40rem;
    overflow-y: scroll;
  }
</style>
