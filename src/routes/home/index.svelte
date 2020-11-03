<script lang="ts">
  import { onMount } from 'svelte';

  import city from '../../stores/city';

  import { getCities } from '../../api';

  import Search from './_components/Search.svelte';
  import Suggestions from './_components/Suggestions.svelte';

  import type { City } from '../../interfaces';

  onMount(() => select(null));

  let citiesP: Promise<City[]> | undefined;
  let previousCities: City[];

  function search(text: string): void {
    console.log('TEXT', text);
    citiesP = fetchCities(text);
  }

  function clear(): void {
    citiesP = undefined;
  }

  function select(c: City | null): void {
    city.set(c);
  }

  function fetchCities(text: string): Promise<City[]> {
    return getCities(text).then(cities => {
      console.log('Villes', cities);
      const currentCities = cities.slice(0, 5);
      previousCities = currentCities;
      return currentCities;
    });
  }
</script>

<svelte:head>
  <title>Livres ouverts</title>
</svelte:head>

<main>
  <Search {search} {clear} selected={$city}>
    {#if citiesP}
      {#await citiesP}
        <Suggestions suggestions={previousCities} {select} />
      {:then cities}
        <Suggestions suggestions={cities} {select} city={$city} />
      {/await}
    {/if}
  </Search>
</main>

<style lang="scss">
  main {
    flex: 1 0;
    display: flex;
    padding-top: 10%;
  }
</style>
