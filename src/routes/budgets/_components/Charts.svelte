<script lang="ts">
  import Bar from './Bar.svelte';
  import { sumBy } from '../../../utils';

  export let values: any[];
  export let selectFonction: (f: string) => void;

  $: total = sumBy(values, 'value');
  $: console.log('total', total);
</script>

<div class="chart">
  {#each values as { label, value, code, clickable }}
    <Bar
      {label}
      {value}
      percentage={value / total}
      handleClick={clickable ? () => selectFonction(code) : undefined}
    />
  {/each}
</div>

<style lang="scss">
  .chart {
    margin-left: 2rem;
    width: 70%;
  }
</style>
