<script lang="ts">
  import Year from './Year.svelte';

  export let valuePs: Promise<number | null>[];
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
    {#await valuePs[i]}
      <Year {year} pending={true} {maxP} />
    {:then value}
      <Year
        {year}
        {value}
        {maxP}
        selected={year === selected}
        select={() => select(year)}
      />
    {/await}
  {/each}
</ul>

<style lang="scss">
  .Years {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 1rem 2rem;
    margin: 0;
    background: #333;
    height: 10rem;
    width: fit-content;
  }
</style>
