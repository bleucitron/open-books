<script>
  import Search from '../components/Search.svelte';
  import Suggestions from '../components/Suggestions.svelte';
  import Sirets from '../components/Sirets.svelte';
  import { getCities, getSirens, getSiret, getBudget } from '../api';

  let citiesP;
  let selectedCity;
  let selectedSiret;
  let siretsP;
  let searching = false;

  $: departement = selectedCity && selectedCity.departement;

  function search(text) {
    searching = true;
    siretsP = null;
    selectedCity = null;

    console.log('TEXT', text);

    citiesP = fetchCities(text);
  }

  function select(city) {
    citiesP = null;

    selectedCity = city;
    siretsP = fetchBudgets(city).then(res => {
      console.log('Budgets', res);
      return res;
    });
  }

  function fetchCities(text) {
    return getCities(text).then(cities => {
      console.log('Villes', cities);
      searching = false;
      return cities.slice(0, 5);
    });
  }

  function fetchBudgets(city) {
    const { nom, code } = city;

    return getSirens(nom, code).then(siren => {
      console.log('SIREN', siren);
      return getBudget(siren, code).then(data => {
        const sirets = [
          ...new Set(data.records.map(({ fields }) => fields.ident)),
        ];

        console.log('SIRETS in data', sirets);
        const dataBySiret = Object.fromEntries(
          sirets.map(siret => {
            const records = data.records.filter(
              ({ fields }) => fields.ident === siret,
            );

            return [siret, { id: siret, city, records }];
          }),
        );

        return Promise.allSettled(sirets.map(getSiret)).then(res => {
          const data = res.filter(r => r.value).map(r => r.value);

          data.forEach(d => {
            dataBySiret[d.siret].detail = d;
          });

          return Object.values(dataBySiret);
        });
      });
    });
  }
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
<Search {search} {searching} selected={selectedCity}>
  {#if citiesP}
    {#await citiesP then cities}
      <Suggestions suggestions={cities} {select} />
    {/await}
  {/if}
</Search>
{#if siretsP}
  {#await siretsP}
    <div>Loading</div>
  {:then sirets}
    <Sirets {sirets} />
  {:catch error}
    <div style="color: red">{error}</div>
  {/await}
{/if}
