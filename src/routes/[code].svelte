<script context="module">
  import { getBudgetsBySiret, getSirens, getCity } from '../api';

  export async function preload(page, session) {
    const { code } = page.params;
    const { name } = page.query;

    const siren = await getSirens(name, code);
    return {
      siren,
      code,
    };
  }
</script>

<script>
  import { city } from '../stores.js';
  import Sirets from '../components/Sirets.svelte';
  export let siren;
  export let code;

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(code).then(result => {
        city.set(result);
        return result;
      });

  const siretsP = getBudgetsBySiret(siren, code);
</script>

<svelte:head>
  <title>{`Budget pour ${siren}`}</title>
</svelte:head>

{#await cityP}
  <div>Loading</div>
{:then city}
  <h1>{city.nom}</h1>
{:catch error}
  <div style="color: red">{error}</div>
{/await}

<div class="content">
  {#await siretsP}
    <div>Loading</div>
  {:then sirets}
    <Sirets {sirets} />
  {:catch error}
    <div style="color: red">{error}</div>
  {/await}
</div>
