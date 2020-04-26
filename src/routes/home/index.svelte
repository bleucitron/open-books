<script>
  import city from '../../stores/city';

  import { getCities, getSirens } from '../../api';

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
  header {
    h1 {
      margin: 2rem auto 1rem;
      font-size: 2.8em;
      text-transform: uppercase;
      font-weight: 700;
      text-align: center;
    }

    p {
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
<Search {search} {clear} selected={$city}>
  {#if citiesP}
    {#await citiesP}
      <Suggestions suggestions={previousCities} {select} />
    {:then cities}
      <Suggestions suggestions={cities} {select} />
    {/await}
  {/if}
</Search>
