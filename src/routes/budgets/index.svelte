<script context="module">
  import { getSirens, getMainSiret, getCity } from '../../api';
  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const years = [...Array(end - start).keys()].map(x => x + start);

  export async function preload(page, session) {
    let { name, insee, siren, siret } = page.query;

    siren = siren || (await getSirens(name, insee));

    siret = siret || (await getMainSiret(siren));

    return {
      siren,
      siret,
      insee,
      name,
    };
  }
</script>

<script>
  import { goto } from '@sapper/app';
  import Spinner from 'svelte-spinner';

  import city from '../../stores/city';
  import budgets, { createBudget } from '../../stores/budgets';
  import Sirets from './_components/Sirets.svelte';
  import Years from './_components/Years.svelte';
  import { getRecords, getRecordsFromSiren } from '../../api';

  import { makeBudget } from './_utils';

  export let siren;
  export let siret;
  export let insee;
  export let name;

  let selectedSiret = siret;
  let selectedYear = 2018;
  let budget;
  let label;

  function select(siret) {
    selectedSiret = siret;
    goto(`/budgets?name=${name}&insee=${insee}&siren=${siren}&siret=${siret}`);
  }

  function formatNavLabel(label) {
    const n = name.toLowerCase();

    if (label === n) return 'Commune';
    return label.replace(n, '');
  }

  function formatTitleLabel(label) {
    return label ? label.replace(name.toLowerCase(), '') : '';
  }

  $: {
    budget = budgets.get()[selectedSiret] || createBudget(selectedSiret);

    const yearBudget = budget.get()[selectedYear];

    if (yearBudget) label = yearBudget.label;
  }

  $: budgetPs = years.map(year => {
    const budgetFromStore = budget.get()[year];

    return budgetFromStore !== undefined
      ? Promise.resolve(budgetFromStore)
      : getRecords({ ident: selectedSiret, year })
          .catch(() => [])
          .then(records => {
            const b = makeBudget(selectedSiret, year, records);
            budget.add(year, b);

            if (!label && b) {
              label = b.label;
            }
            return b;
          });
  });

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.credit),
  );

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  const siretsP = getRecordsFromSiren(siren, selectedYear)
    .then(results =>
      results
        .sort((r1, r2) => r1.siret - r2.siret)
        .map(({ siret, records }) => {
          const b = makeBudget(siret, selectedYear, records);

          if (siret !== selectedSiret) {
            createBudget(siret).add(selectedYear, b);
          }

          return {
            id: siret,
            label: formatNavLabel(b.label),
          };
        }),
    )
    .then(sirets => {
      if (sirets.length === 1 && sirets[0].id === selectedSiret) {
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
    <h2>{formatTitleLabel(label)}</h2>
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
  <Sirets {siretsP} selected={selectedSiret} {select} />
  <div class="dataviz">
    <Years {years} {valuePs} />
  </div>
</div>
