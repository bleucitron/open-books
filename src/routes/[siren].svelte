<script context="module">
  import { getSiret, getBudget } from '../api';

  export async function preload(page, session) {
    const { siren } = page.params;
    const { name, code } = page.query;

    return { siren, name, code };
  }
</script>

<script>
  import { city } from '../stores.js';
  import Sirets from '../components/Sirets.svelte';
  export let siren;
  export let code;

  const siretsP = fetchBudgets(siren, code);

  function fetchBudgets(siren, code) {
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

          return [siret, { id: siret, records }];
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
  }
</script>

<svelte:head>
  <title>{`Budget pour ${siren}`}</title>
</svelte:head>

<h1>{$city.nom}</h1>

<div class="content">
  {#await siretsP}
    <div>Loading</div>
  {:then sirets}
    <Sirets {sirets} />
  {:catch error}
    <div style="color: red">{error}</div>
  {/await}
</div>
