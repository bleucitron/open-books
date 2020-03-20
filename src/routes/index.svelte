<script>
  import Search from '../components/Search.svelte';
  import Suggestions from '../components/Suggestions.svelte';
  import { getCities, getSirens, getSiret, getBudget } from '../api';

  let value = '';
  let citiesP;
  let selected;
  let budgets;
  let searching = false;

  function search(text) {
    searching = true;
    citiesP = fetchCities(text);
  }

  function select(city) {
    citiesP = null;

    fetchBudgets(city).then(res => {
      budgets = res;
      console.log('Budgets', budgets);
    });
  }

  function fetchCities(text) {
    console.log('TEXT', text);

    return getCities(text).then(cities => {
      console.log('Villes', cities);
      searching = false;
      return cities.slice(0, 5);
    });
  }

  function fetchBudgets({ nom, code }) {
    return getSirens(nom, code).then(siren => {
      console.log('SIREN', siren);
      return getBudget(siren, code).then(data => {
        const sirets = [
          ...new Set(data.records.map(({ fields }) => fields.ident)),
        ];

        console.log('SIRETS in data', sirets);
        const dataBySiret = Object.fromEntries(
          sirets.map(siret => {
            const nb = data.records.filter(
              ({ fields }) => fields.ident === siret,
            ).length;

            return [siret, { siret, nb }];
          }),
        );

        budgets = dataBySiret;

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
<Search {search} {searching}>
  {#if citiesP}
    {#await citiesP then cities}
      <Suggestions suggestions={cities} {select} />
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
