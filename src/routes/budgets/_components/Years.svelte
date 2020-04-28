<script>
  import Spinner from 'svelte-spinner';
  import Year from './Year.svelte';

  export let valuePs;
  export let years;
  export let select;
  export let selected;

  $: maxP = Promise.all(valuePs).then(values => {
    return Math.max(...values.filter(value => value));
  });
</script>

<style>
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
        select={() => select(year)} />
    {/await}
  {/each}
</ul>
