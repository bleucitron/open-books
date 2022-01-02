<script lang="ts">
  import Year from './Year.svelte';

  export let valuePs: Promise<number>[];
  export let years: number[];
  export let select: (y: number) => void;
  export let selected: number;

  $: maxP = Promise.all(valuePs).then(values => {
    const v = values.filter(v => v) as number[];

    return Math.max(...v);
  });
</script>

<ul class="Years">
  {#each years as year, i}
    <Year
      {year}
      valueP={valuePs[i]}
      {maxP}
      selected={year === selected}
      select={() => select(year)}
    />
  {/each}
</ul>

<style lang="scss">
  .Years {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 1rem 2rem;
    margin: 0;
    width: fit-content;
  }
</style>
