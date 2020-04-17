<script context="module">
  import Spinner from 'svelte-spinner';
  import { Map } from 'immutable';

  import city from '../../stores/city';
  import entries from '../../stores/entries';
  import { saveRecords } from '../../stores/entries';
  import Sirets from '../../components/Sirets.svelte';
  import Siret from '../../components/Siret.svelte';
  import {
    getBudgets,
    getBudgetsBySiret,
    getSirens,
    getMainSiret,
    getCity,
  } from '../../api';

  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const years = [...Array(end - start).keys()].map(x => x + start);

  export async function preload(page, session) {
    const { insee, siret } = page.params;
    let { name } = page.query;

    return {
      siret,
      insee,
      name,
    };
  }
</script>

<script>
  export let siren;
  export let siret;
  export let insee;
  export let name;

  let selectedYear = 2018;

  const recordsPs = years.map(year => {
    const records = $entries.getIn([siret, year]);

    if (records) return Promise.resolve(records);

    return getBudgets({ ident: siret, year }).then(records => {
      saveRecords(siret, year, records);

      return records;
    });
  });

  const valuesPs = recordsPs.map(recordsP => {
    return recordsP.then(records => {
      const debit = records.reduce((sum, { sd }) => sum + sd, 0);
      const credit = records.reduce((sum, { sc }) => sum + sc, 0);
      return {
        debit,
        credit,
      };
    });
  });

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
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
      margin: 0;
      display: flex;
    }

    .sirets {
      flex-flow: column;
    }
  }
</style>

<svelte:head>
  {#await cityP}
    <title>{`Budgets pour ${name}`}</title>
  {:then city}
    <title>{`Budgets pour ${name} (${city.departement.code})`}</title>
  {:catch error}
    <title>{`Budgets pour ${name}`}</title>
  {/await}
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
  <ul class="sirets">
    <Siret id={siret} city={{ name, code: insee }} {years} {recordsPs} />
  </ul>
  <ul class="budgets">
    {#each years as year, i}
      {#await valuesPs[i]}
        <li class="year pending">
          <Spinner color="white" class="icon" />
        </li>
      {:then values}
        <li class="year ready">
          <div class="info">{values.debit}</div>
          <div class="info">{values.credit}</div>
        </li>
      {:catch error}
        <li class="year error">
          <i class="fas fa-times info" />
        </li>
      {/await}
    {/each}

  </ul>
</div>
