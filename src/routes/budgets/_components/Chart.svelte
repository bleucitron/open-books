<script lang="ts">
  import Bar from './Bar.svelte';
  import { sumBy } from '../../../utils';
  import type { BarChartValue } from '../../../interfaces';

  export let values: BarChartValue[];

  $: total = sumBy(values, 'value');
  $: max = Math.max(...values.map(({ value }) => value));
</script>

<div class="chart">
  {#each values as { label, value, handleClick }}
    <Bar
      {label}
      {value}
      percentage={value / total}
      width={value / max}
      {handleClick}
    />
  {/each}
</div>

<style lang="scss">
  .chart {
    flex: 1 0;
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    width: 70%;
    max-width: 40rem;
    overflow-y: scroll;
  }
</style>
