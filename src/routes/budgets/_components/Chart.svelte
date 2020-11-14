<script lang="ts">
  import Bar from './Bar.svelte';
  import { sumBy } from '../../../utils';
  import type { Code } from '../../../interfaces';

  export let values: any[];
  export let selectCode: (f: Code) => void;

  $: total = sumBy(values, 'value');
  $: max = Math.max(...values.map(({ value }) => value));
</script>

<div class="chart">
  {#each values as { label, value, code, clickable }}
    <Bar
      {label}
      {value}
      percentage={value / total}
      width={value / max}
      handleClick={clickable ? () => selectCode(code) : undefined}
    />
  {/each}
</div>

<style lang="scss">
  .chart {
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    width: 70%;
    height: 80%;
  }
</style>
