<script>
  import { city } from '../stores.js';
  import { goto } from '@sapper/app';

  import { getCities, getSirens, getSiret } from '../api';

  import Search from '../components/Search.svelte';
  import Suggestions from '../components/Suggestions.svelte';

  let citiesP;
  let previousCities;

  function search(text) {
    console.log('TEXT', text);
    citiesP = fetchCities(text);
  }

  function select(selectedCity) {
    const { nom, code } = selectedCity;
    citiesP = null;

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
  header {
    h1 {
      margin: 0 auto;
      font-size: 2.8em;
      text-transform: uppercase;
      font-weight: 700;
      text-align: center;
    }
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 2em;
    }
  }
</style>

<svelte:head>
  <title>Open Books</title>
</svelte:head>

<header>
  <h1>Livres ouverts</h1>
  <p>Les données budgétaires des communes</p>
</header>
<Search {search} selected={$city}>
  {#if citiesP}
    {#await citiesP}
      <Suggestions suggestions={previousCities} {select} />
    {:then cities}
      <Suggestions suggestions={cities} {select} />
    {/await}
  {/if}
</Search>
