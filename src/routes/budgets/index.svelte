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
  import Spinner from 'svelte-spinner';

  import city from '../../stores/city';
  import budgetsFromStore, { createBudget } from '../../stores/budgets';
  import Sirets from './_components/Sirets.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';
  import { getRecords, getRecordsFromSiren } from '../../api';

  import { makeBudget } from './_utils';

  export let siren;
  export let siret;
  export let year;
  export let insee;
  export let name;

  let budget;

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

  function formatNavLabel(label) {
    const n = name.toLowerCase();

    if (label === n) return 'Commune';
    return label.replace(n, '');
  }

  function formatTitleLabel(label) {
    return label ? label.replace(name.toLowerCase(), '') : '';
  }

  $: budgets = budgetsFromStore.get()[siret] || createBudget(siret);

  $: budgetPs = years.map(y => {
    const budgetFromStore = budgets.get()[y];

    return budgetFromStore !== undefined
      ? Promise.resolve(budgetFromStore)
      : getRecords({ ident: siret, year: y })
          .catch(() => [])
          .then(records => {
            const b = makeBudget(siret, y, records);
            budgets.add(y, b);

            return b;
          });
  });

  $: {
    budget = undefined;
    const yearIndex = years.findIndex(y => y === year);
    budgetPs[yearIndex].then(b => (budget = b));
  }

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.credit),
  );

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
          const b = makeBudget(s, defaultYear, records);

          if (s !== siret) {
            createBudget(s).add(defaultYear, b);
          }

          return {
            id: s,
            label: formatNavLabel(b.label),
          };
        }),
    )
    .then(sirets => {
      if (sirets.length === 1) {
        return [];
      }
      return sirets;
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

    .labels {
      display: flex;
      align-items: flex-end;
    }

    h1 {
      font-size: 3rem;
      line-height: 2rem;
    }

    h2 {
      margin-left: 1rem;
      text-transform: capitalize;
      line-height: 0.7;
    }

    .departement {
      display: flex;

      .hyphen {
        margin: 0 0.5rem;
      }
    }
  }

  .content {
    flex: 1 0;
    display: flex;
  }

  .dataviz {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
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

<header>
  <div class="labels">
    <h1>{name}</h1>
    {#if budget}
      <h2>{formatTitleLabel(budget.label)}</h2>
    {/if}
  </div>

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
  <nav>
    <Sirets {siretsP} selected={siret} select={selectSiret} />
  </nav>
  <div class="dataviz">
    <Years {years} {valuePs} selected={year} select={selectYear} />
    <Summary {year} {budget} />
  </div>
  <div class="info" />
</div>
