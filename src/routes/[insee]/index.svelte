<script context="module">
  import { getSirens, getMainSiret, getCity } from '../../api';
  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const years = [...Array(end - start).keys()].map(x => x + start);

  export async function preload(page, session) {
    const { insee } = page.params;
    let { name } = page.query;

    const siren = await getSirens(name, insee);

    const siret = await getMainSiret(siren);

    return {
      siren,
      siret,
      insee,
      name,
    };
  }
</script>

<script>
  import Spinner from 'svelte-spinner';
  import { Map } from 'immutable';
  import city from '../../stores/city';
  import { saveRecords } from '../../stores/entries';
  import Sirets from '../../components/Sirets.svelte';
  import Siret from '../../components/Siret.svelte';
  import { getBudgets, getBudgetsFromSiren } from '../../api';

  export let siren;
  export let siret;
  export let insee;
  export let name;

  let selectedYear = 2018;

  const recordsP = years.map(year => {
    return getBudgets({ ident: siret, year })
      .then(records => {
        saveRecords(siret, year, records);

        return records;
      })
      .catch(() => []);
  });

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  const siretsP = getBudgetsFromSiren(siren, selectedYear).then(results => {
    return results
      .filter(result => result.siret !== siret)
      .sort((r1, r2) => {
        return r1.siret - r2.siret;
      })
      .map(({ siret, records }) => {
        const recordsPs = years.map(year => {
          if (year === selectedYear) return Promise.resolve(records);

          return getBudgets({ ident: siret, year })
            .then(records => {
              saveRecords(siret, year, records);
              return records;
            })
            .catch(() => []);
        });

        return { id: siret, recordsPs };
      });
  });
</script>

<style lang="scss">
  header {
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
  <ul>
    <Siret
      id={siret}
      city={{ name, code: insee }}
      {years}
      recordsPs={recordsP} />
    {#await siretsP}
      <div class="spinner">
        <Spinner />
      </div>
    {:then sirets}
      {#each sirets as siret}
        <Siret
          id={siret.id}
          city={{ name, code: insee }}
          {name}
          {years}
          recordsPs={siret.recordsPs} />
      {/each}
    {:catch error}
      <div style="color: red">{error}</div>
    {/await}
  </ul>
</div>
