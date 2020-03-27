<script>
  import { city } from '../stores.js';
  import { goto } from '@sapper/app';

  import { getCities, getSirens, getSiret, getBudget } from '../api';

  import Search from '../components/Search.svelte';
  import Suggestions from '../components/Suggestions.svelte';

  let citiesP;
  let previousCities;
  let siretsP;
  let searching = false;

  $: departement = $city && $city.departement;

  function search(text) {
    console.log('TEXT', text);
    searching = true;
    citiesP = fetchCities(text);
  }

  function select(c) {
    citiesP = null;

    city.set(c);
    siretsP = fetchBudgets(c).then(res => {
      console.log('Budgets', res);
      return res;
    });
  }

  function fetchCities(text) {
    return getCities(text).then(cities => {
      console.log('Villes', cities);
      searching = false;
      const currentCities = cities.slice(0, 5);
      previousCities = currentCities;
      return currentCities;
    });
  }

  function fetchBudgets(city) {
    const { nom, code } = city;

    return getSirens(nom, code).then(siren => {
      console.log('SIREN', siren);

      city = {
        ...city,
        siren,
      };

      goto(`/${siren}?name=${nom}&code=${code}`);
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
<Search {search} {searching} selected={$city}>
  {#if citiesP}
    {#await citiesP}
      <Suggestions suggestions={previousCities} />
    {:then cities}
      <Suggestions suggestions={cities} {select} />
    {/await}
  {/if}
</Search>
