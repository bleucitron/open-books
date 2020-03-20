<script>
  import Search from '../components/Search.svelte';
  import Suggestions from '../components/Suggestions.svelte';
  import { getCities, getSirens, getSiret, getBudget } from '../api';

  let citiesP;
  let searching = false;

  function search(text) {
    searching = true;
    citiesP = fetchCities(text);
  }

  function fetchCities(text) {
    console.log('TEXT', text);

    return getCities(text).then(cities => {
      console.log('Villes', cities);
      searching = false;
      return cities.slice(0, 5);
    });
  }

  // function fetchCities(text) {
  //   console.log('TEXT', text);

  //   return getCities(text).then(data => {
  //     console.log('Villes', data);

  //     const { nom, code } = data[0];

  //     console.log('NOM', nom, code);

  //     return getSirens(nom, code).then(siren => {
  //       console.log('SIREN', siren);
  //       return getBudget(siren, code).then(data => {
  //         const sirets = [
  //           ...new Set(data.records.map(({ fields }) => fields.ident)),
  //         ];

  //         console.log('SIRETS in data', sirets);
  //         const dataBySiret = Object.fromEntries(
  //           sirets.map(siret => {
  //             const nb = data.records.filter(
  //               ({ fields }) => fields.ident === siret,
  //             ).length;

  //             console.log('SIRET', siret);
  //             console.log('NB', nb);

  //             return [siret, { siret, nb }];
  //           }),
  //         );

  //         console.log('Data by Siret', dataBySiret);

  //         return Promise.allSettled(sirets.map(getSiret)).then(res => {
  //           console.log('RES', res);

  //           const data = res.filter(r => r.value).map(r => r.value);

  //           data.forEach(d => {
  //             dataBySiret[d.siret].detail = d;
  //           });

  //           return Object.values(dataBySiret);
  //         });
  //       });
  //     });
  //   });
  // }

  let value = '';

  // let cities;

  // function setCities(data) {
  //   console.log('Data', data);
  //   cities = data;
  // }
</script>

<style>
  h1 {
    margin: 0 auto;
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    text-align: center;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Open Books</title>
</svelte:head>

<h1>Find by SIRET</h1>
<Search {search} {searching}>
  {#if citiesP}
    {#await citiesP then cities}
      <Suggestions suggestions="{cities}" />
    {/await}
  {/if}
</Search>

<!-- {#if dataP} {#await dataP}
<p>...waiting</p>
{:then ets}
<ul>
  {#each ets as et}
  <li>
    {#if et.detail}
    <div>{et.detail.uniteLegale.denominationUniteLegale}</div>
    {:else}
    <div>Unknown</div>
    {/if}
    <div>{et.siret}</div>
    <div>{et.nb}</div>
  </li>
  {/each}
</ul>
{:catch error}
<p style="color: red">{error.message}</p>
{/await} {/if} -->
