<script>
  export let search;
  export let searching;
  // import { getCities, getSirens, getSiret, getBudget } from '../api';

  // let dataP;

  // function search(e) {
  //   const text = e.target.value;
  //   dataP = fetchCities(text);
  // }

  // function fetchCities(text) {
  //   console.log('TEXT', text);

  //   return getCities(text).then(cities => {
  //     console.log('Villes', cities);

  //     return cities;
  //   });
  // }

  let value = '';
</script>

<style>
  .searchbar {
    display: flex;
  }
</style>

<div>
  <div class="searchbar">
    <div>{searching}</div>
    <input bind:value on:change="{search}" />
  </div>
  <slot></slot>
</div>
