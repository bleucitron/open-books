<script context="module">
  import { getSirens, getMainSiret, getCity } from '../../api';
  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const years = [...Array(end - start).keys()].map(x => x + start);

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
  import { city, entries } from '../../stores.js';
  import Sirets from '../../components/Sirets.svelte';
  import Siret from '../../components/Siret.svelte';
  import { getBudgets, getBudgetsBySiret } from '../../api';

  export let siren;
  export let mainSiret;
  export let insee;
  export let name;

  let selectedSiret = mainSiret;
  let selectedYear = 2018;

  function saveRecords(siret, year, records) {
    entries.set($entries.setIn([siret, year], records));
    // console.log('ENTRIES', $entries.toJS());
  }

  const mainRecordsP = years.map(year => {
    return getBudgets({ ident: mainSiret, year }).then(records => {
      saveRecords(mainSiret, year, records);

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
      .filter(result => result.siret !== mainSiret)
      .sort((r1, r2) => {
        return r2.records.length - r1.records.length;
      })
      .map(({ siret, records }) => {
        const label = [
          ...new Set(records.map(record => record.lbudg.toLowerCase())),
        ];

        const recordsPs = years.map(year => {
          if (year === selectedYear) return Promise.resolve(records);

          return getBudgets({ ident: siret, year }).then(records => {
            const label = [...new Set(records.map(record => record.lbudg))];

            saveRecords(siret, year, records);
            return records;
          });
        });

        return { id: siret, label, recordsPs };
      });
  });
</script>

<style lang="scss">
  header {
    height: 2rem;
    padding: 0 2rem;
    padding-top: 2rem;
    background: #333;
    color: white;

    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    h1 {
      font-size: 3rem;
      line-height: 2rem;
    }

    .departement {
      display: flex;

      .hyphen {
        margin: 0 0.5rem;
      }
    }
  }

  .spinner {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .content {
    flex: 1 0;

    ul {
      height: 100%;
      margin: 0;
      display: flex;
      flex-flow: column;
    }
  }
</style>

<svelte:head>
  <title>{`Budget pour ${siren}`}</title>
</svelte:head>

<header>
  <h1>{name}</h1>

  <div class="departement">
    {#await cityP}
      <Spinner color="white" />
    {:then city}
      <div class="code">{city.departement.code}</div>
      <div class="hyphen">-</div>
      <div class="name">{city.departement.nom}</div>
    {:catch error}
      <div style="color: red">{error}</div>
    {/await}
  </div>
</header>

<div class="content">
  <ul>
    <Siret siret={mainSiret} {years} recordsPs={mainRecordsP} />
    {#await siretsP}
      <div class="spinner">
        <Spinner />
      </div>
    {:then sirets}
      {#each sirets as siret}
        <Siret
          {years}
          siret={siret.id}
          label={siret.label}
          recordsPs={siret.recordsPs} />
      {/each}
    {:catch error}
      <div style="color: red">{error}</div>
    {/await}
  </ul>
</div>
