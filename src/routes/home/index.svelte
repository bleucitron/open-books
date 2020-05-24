<script>
  import city from '../../stores/city';

  import { getCities } from '../../api';

  import Nav from '../_components/Nav.svelte';
  import Search from './_components/Search.svelte';
  import Suggestions from './_components/Suggestions.svelte';

  let citiesP;
  let previousCities;

  function search(text) {
    console.log('TEXT', text);
    citiesP = fetchCities(text);
  }

  function clear() {
    citiesP = null;
  }

  function select(selectedCity) {
    const { nom, code } = selectedCity;
    clear();

    city.set(selectedCity);
  }

  function fetchCities(text) {
    return getCities(text).then(cities => {
      console.log('Villes', cities);
      const currentCities = cities.slice(0, 5);
      previousCities = currentCities;
      return currentCities;
    });
  }
</script>

<style lang="scss">
  main {
    flex: 1 0;
    display: flex;
    align-items: center;
    padding-bottom: 40%;
  }
</style>

<svelte:head>
  <title>Livres ouverts</title>
</svelte:head>

<main>
  <Search {search} {clear} selected={$city}>
    {#if citiesP}
      {#await citiesP}
        <Suggestions suggestions={previousCities} {select} />
      {:then cities}
        <Suggestions suggestions={cities} {select} />
      {/await}
    {/if}
  </Search>
</main>
