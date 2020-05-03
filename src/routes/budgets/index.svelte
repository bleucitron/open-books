<script context="module">
  import { getSirens, getMainSiret, getCity } from '../../api';
  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const defaultYear = end - 2;
  const years = [...Array(end - start).keys()].map(x => x + start);

  export async function preload(page, session) {
    let { name, insee, siren, siret, year } = page.query;

    siren = siren || (await getSirens(name, insee));

    siret = siret || (await getMainSiret(siren));

    year = parseInt(year) || defaultYear;

    return {
      siren,
      siret,
      year,
      insee,
      name,
    };
  }
</script>

<script>
  import { goto } from '@sapper/app';

  import city from '../../stores/city';
  import budgetsFromStore, { createBudget } from '../../stores/budgets';
  import Nav from '../_components/Nav.svelte';
  import Sirets from './_components/Sirets.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';
  import Csv from './_components/Csv.svelte';
  import Spinner from './_components/Spinner.svelte';
  import { getRecords, getRecordsFromSiren } from '../../api';

  import { makeBudget } from './_utils';

  export let siren;
  export let siret;
  export let year;
  export let insee;
  export let name;

  let budget;
  let labels;

  function selectSiret(s) {
    goto(
      `/budgets?name=${name}&insee=${insee}&siren=${siren}&siret=${s}&year=${year}`,
    );
  }

  function selectYear(y) {
    goto(
      `/budgets?name=${name}&insee=${insee}&siren=${siren}&siret=${siret}&year=${y}`,
    );
  }

  $: budgets = budgetsFromStore.get(siret) || createBudget(siret);

  $: budgetPs = years.map(y => {
    const budgetFromStore = budgets.get(y);

    return budgetFromStore !== undefined
      ? Promise.resolve(budgetFromStore)
      : getRecords({ ident: siret, year: y })
          .catch(() => [])
          .then(records => {
            const b = makeBudget({ city: name, siret, year: y, records });
            budgets.add(y, b);

            return b;
          });
  });

  $: yearIndex = years.findIndex(y => y === year);
  $: label = labels && labels.find(l => l.id === siret).label;

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.credit),
  );

  $: {
    budget = undefined;
    budgetPs[yearIndex].then(b => (budget = b));
  }

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  const siretsP = getRecordsFromSiren(siren, defaultYear)
    .then(results =>
      results
        .sort((r1, r2) => r1.siret - r2.siret)
        .map(({ siret: s, records }) => {
          const b = makeBudget({
            city: name,
            siret: s,
            year: defaultYear,
            records,
          });

          if (s !== siret) {
            createBudget(s).add(defaultYear, b);
          }

          return {
            id: s,
            label: b.label,
          };
        }),
    )
    .then(sirets => {
      labels = sirets;

      if (sirets.length === 1) {
        return [];
      }

      return sirets;
    });
</script>

<style lang="scss">
  header {
    padding: 0 2rem;
    padding-top: 2.5rem;
    padding-bottom: 0.2rem;
    background: #151515;
    color: white;

    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .labels {
      display: flex;
      align-items: flex-end;
    }

    h1 {
      font-size: 3rem;
      line-height: 3rem;
    }

    h2 {
      margin-left: 1rem;
      line-height: 1.9rem;
      text-transform: capitalize;
    }

    .departement {
      display: flex;

      .hyphen {
        margin: 0 0.5rem;
      }
    }
  }

  h3 {
    font-size: 2.5rem;
    text-align: center;
    position: relative;
  }

  menu {
    margin: 0;
    color: white;
    background: #333;
    display: flex;
    padding: 1rem 2rem;
  }

  .content {
    flex: 1 0;
    display: flex;
    flex-flow: column;
  }

  .dataviz {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    padding: 1rem 2rem 5rem;
    background: white;
  }

  .info {
    width: 15rem;
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

<Nav />

<header>
  <div class="labels">
    <h1>{name}</h1>
    {#await siretsP then sirets}
      {#if sirets.length !== 0}
        <h2>{label}</h2>
      {/if}
    {/await}
  </div>

  <div class="departement">
    {#await cityP}
      <Spinner />
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
  <menu>
    <Sirets {siretsP} selected={siret} select={selectSiret} />
    <Years {years} {valuePs} selected={year} select={selectYear} />
  </menu>
  <div class="dataviz">
  <h3>
    {year}
    {#if budget}
      <Csv data={budget} />
    {/if}
  </h3>
    <Summary {year} {budget} />
  </div>
  <div class="info" />
</div>
