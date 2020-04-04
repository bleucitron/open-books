<script context="module">
  import { getSirens, getMainSiret, getCity } from '../api';
  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const years = [...Array(end - start).keys()].map(x => x + start).reverse();

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
  import { getBudgets, getBudgetsBySiret } from '../api';

  export let siren;
  export let mainSiret;
  export let insee;
  export let name;

  let entries = new Map();
  let selectedSiret = mainSiret;
  let selectedYear = 2018;

  function saveRecords(siret, year, records) {
    entries = entries.setIn([mainSiret, year], records);
    // console.log('Entries', entries.toJS());
  }

  const mainRecordsP = years.map(year => {
    return getBudgets({ ident: mainSiret, year }).then(({ records }) => {
      saveRecords(year, records);
      return records;
    });
  });

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  const siretsP = getBudgetsBySiret(siren, selectedYear).then(results => {
    return results
      .filter(record => record.siret !== mainSiret)
      .sort((r1, r2) => {
        return r2.records.length - r1.records.length;
      })
      .map(({ siret, year, records }) => {
        const recordsPs = years.map(year => {
          if (year === selectedYear) return Promise.resolve(records);

          return getBudgets({ ident: siret, year }).then(({ records }) => {
            saveRecords(year, records);
            return records;
          });
        });

        return { id: siret, recordsPs };
      });
  });
</script>

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    padding-top: 2rem;
    background: #333;
    color: white;

    h1 {
      margin-bottom: 0;
      font-size: 3rem;
      line-height: 2rem;
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
    <Siret siret={mainSiret} {years} recordsPs={mainRecordsP} />
    {#await siretsP}
      <Spinner />
    {:then sirets}
      {#each sirets as siret}
        <Siret siret={siret.id} {years} recordsPs={siret.recordsPs} />
      {/each}
    {:catch error}
      <div style="color: red">{error}</div>
    {/await}
  </ul>
</div>
