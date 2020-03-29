<script context="module">
  import { getBudgetsBySiret, getSirens, getCity } from '../api';

  export async function preload(page, session) {
    const { insee } = page.params;
    const { name } = page.query;

    const siren = await getSirens(name, insee);
    return {
      siren,
      insee,
      name,
    };
  }
</script>

<script>
  import Spinner from 'svelte-spinner';
  import { city } from '../stores.js';
  import Sirets from '../components/Sirets.svelte';

  export let siren;
  export let insee;
  export let name;

  const start = 2012;
  const end = new Date().getFullYear();

  const years = [...Array(end - start).keys()].map(x => x + start);

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  const siretsP = Promise.allSettled(
    years.map(year => getBudgetsBySiret(siren, year)),
  ).then(results => {
    console.log(
      'RESULTS',
      results
        .filter(r => r.value)
        .map(r => r.value)
        .flat(),
    );
    return results
      .filter(r => r.value)
      .map(r => r.value)
      .flat();
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
  {#await siretsP}
    <Spinner />
  {:then sirets}
    <Sirets {sirets} />
  {:catch error}
    <div style="color: red">{error}</div>
  {/await}
</div>
