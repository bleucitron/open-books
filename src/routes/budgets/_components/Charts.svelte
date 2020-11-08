<script lang="ts">
  import Bar from './Bar.svelte';
  import { sumBy } from '../../../utils';
  import type { Code } from '../../../interfaces';

  export let values: any[];
  export let selectCode: (f: Code) => void;

  $: total = sumBy(values, 'value');
</script>

<div class="chart">
  {#each values as { label, value, code, clickable }}
    <Bar
      {label}
      {value}
      percentage={value / total}
      handleClick={clickable ? () => selectCode(code) : undefined}
    />
  {/each}
</div>

<style lang="scss">
  .chart {
    margin-left: 2rem;
    width: 70%;
  }
</style>
