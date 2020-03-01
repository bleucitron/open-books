<script>
  import { onMount } from 'svelte';
  import fetchSiret from '../api.js';

  let dataP;
  function fetchData(e) {
    dataP = fetchSiret(value).then(([siren, result]) => {
      console.log('SIREN results', siren);
      console.log('DATA results', result.data);
      const exercices = new Set(
        result.data.records.map(record => record.fields.exer),
      );

      return { info: siren.data.etablissement, records: result.data.records };
    });
  }

  let value = '';
</script>

<style>
  h1,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
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
<input bind:value on:change="{fetchData}" />

{#if dataP} {#await dataP}
<p>...waiting</p>
{:then data}
<p>Etablissement {data.info.uniteLegale.denominationUniteLegale}</p>
{:catch error}
<p style="color: red">{error.message}</p>
{/await} {/if}
