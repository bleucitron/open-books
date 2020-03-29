<script context="module">
  import {
    getBudgetsBySiret,
    getSirens,
    getMainSiret,
    getBudgets,
    getCity,
  } from '../api';

  export async function preload(page, session) {
    const { insee } = page.params;
    const { name } = page.query;

    const siren = await getSirens(name, insee);
    const mainSiret = await getMainSiret(siren);

    return {
      siren,
      mainSiret,
      insee,
      name,
    };
  }
</script>

<script>
  import { Map } from 'immutable';
  import Spinner from 'svelte-spinner';
  import { city } from '../stores.js';
  import Sirets from '../components/Sirets.svelte';

  export let siren;
  export let mainSiret;
  export let insee;
  export let name;

  let entries = new Map();
  let selectedSiret = mainSiret;
  let selectedYear = 2018;

  const start = 2012;
  const end = new Date().getFullYear();

  const years = [...Array(end - start).keys()].map(x => x + start);

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  getBudgets({ ident: mainSiret, year: 2018 }).then(d => {
    entries = Map({ [mainSiret]: { 2018: d.records } });
  });
  $: {
    console.log('ENTRIES', entries.getIn([mainSiret, 2018]));
  }

  // years.map(year => getBudgetsBySiret(siren, year).then(results => {
  //   results.forEach(record => {
  //     entries = {
  //       ...entries,
  //       [record.siret]:
  //     }
  //   })

  //   entries = {
  //     ...entries,

  //   }
  // }))
</script>

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin-bottom: 0;
    }
  }

  .departement {
    display: flex;
    padding: 0 1rem;

    .hyphen {
      margin: 0 0.5rem;
    }
  }
</style>

<svelte:head>
  <title>{`Budget pour ${siren}`}</title>
</svelte:head>

<header>
  <h1>{name}</h1>
  {#await cityP}
    <Spinner />
  {:then city}
    <div class="departement">
      <div class="code">{city.departement.code}</div>
      <div class="hyphen">-</div>
      <div class="name">{city.departement.nom}</div>
    </div>
  {:catch error}
    <div style="color: red">{error}</div>
  {/await}
</header>

<div class="content">
  <!-- {#await siretsP}
    <Spinner />
  {:then sirets}
    <Sirets {sirets} />
  {:catch error}
    <div style="color: red">{error}</div>
  {/await} -->
</div>
