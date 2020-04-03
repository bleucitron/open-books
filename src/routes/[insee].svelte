<script context="module">
  import { getSirens, getMainSiret, getCity } from '../api';

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
  import Spinner from 'svelte-spinner';
  import { Map } from 'immutable';
  import { city } from '../stores.js';
  import Sirets from '../components/Sirets.svelte';
  import Siret from '../components/Siret.svelte';
  import { getBudgetsBySiret } from '../api';

  export let siren;
  export let mainSiret;
  export let insee;
  export let name;

  let entries = new Map();
  let selectedSiret = mainSiret;
  let selectedYear = 2018;

  function saveRecords(siret, year, records) {
    entries = entries.setIn([mainSiret, year], records);
    console.log('Entries', entries.toJS());
  }

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  const budgetsP = getBudgetsBySiret(siren).then(results => {
    results.forEach(({ siret, year, records }) => {
      if (siret !== mainSiret) entries.setIn([siret, year], records);
    });
  });
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
  <ul>
    <Siret
      siret={mainSiret}
      save={(...args) => saveRecords(mainSiret, ...args)} />
  </ul>
</div>
