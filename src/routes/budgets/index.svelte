<script context="module">
  import { getSiretsFromInsee, getCity } from '../../api';
  import { extractSirens } from '../../api/utils/siren';

  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();
  const defaultYear = end - 2;
  const years = [...Array(end - start).keys()].map(x => x + start);

  export async function preload(page, session) {
    let { name, insee, siret, year } = page.query;

    const siretsFromCode = await getSiretsFromInsee(name, insee);

    const sirens = extractSirens(siretsFromCode);
    const sirets = siretsFromCode
      .filter(e => e.etablissementSiege)
      .map(e => e.siret)
      .sort();

    siret = siret || sirets[0];

    year = parseInt(year) || defaultYear;

    return {
      sirens,
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
  import Nav from '../_components/Nav.svelte';
  import Sirets from './_components/Sirets.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';
  import Spinner from './_components/Spinner.svelte';
  import { getRecords } from '../../api';

  import { makeBudget, makeId, orderRecordsBySiret } from './_utils';

  export let sirens;
  export let siret;
  export let year;
  export let insee;
  export let name;

  let budgetById = {};
  let labels;

  function selectSiret(s) {
    goto(`/budgets?name=${name}&insee=${insee}&siret=${s}&year=${year}`);
  }

  function selectYear(y) {
    goto(`/budgets?name=${name}&insee=${insee}&siret=${siret}&year=${y}`);
  }

  function getBudget(siret, year) {
    const id = makeId(siret, year);
    const budget = budgetById[id];

    if (budget === null) return Promise.resolve(null);

    return budget !== undefined
      ? Promise.resolve(budget)
      : getRecords({ ident: [siret], year })
          .catch(() => [])
          .then(records => {
            const b = makeBudget({ city: name, siret, year, records });

            budgetById[id] = b;

            return b;
          });
  }

  $: budgetPs = years.map(y => getBudget(siret, y));

  $: yearIndex = years.findIndex(y => y === year);
  $: label = labels && labels[siret] && labels[siret].label;

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.credit),
  );

  $: id = makeId(siret, year);
  $: budget = budgetById[id];

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  [...years].reverse().map(year => {
    getRecords({ siren: sirens, year }).then(records => {
      const data = orderRecordsBySiret(records).map(({ siret: s, records }) => {
        const b = makeBudget({
          city: name,
          siret: s,
          year,
          records,
        });

        const id = makeId(s, year);
        if (s !== siret) budgetById[id] = b;

        return [s, { siret: s, label: b.label }];
      });

      const newLabels = Object.fromEntries(data);
      labels = labels ? { ...labels, ...newLabels } : { ...newLabels };
    });
  });
</script>

<style lang="scss">
  header {
    padding: 0.5rem;
    padding-bottom: 0;
    background: #151515;
    color: white;

    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .labels {
      display: flex;
      align-items: baseline;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.2rem;
      margin-left: 1rem;
      text-transform: capitalize;
    }

    .departement {
      display: flex;

      .hyphen {
        margin: 0 0.5rem;
      }
    }
  }

  menu {
    margin: 0;
    color: white;
    background: #333;
    display: flex;
    padding: 1rem 1.5rem;
  }

  .content {
    flex: 1 0;
    display: flex;
    flex-flow: row;
  }

  .dataviz {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: #333;
  }

  .back {
    font-size: 1.4rem;
    width: 1.4rem;
    margin-left: 0.5rem;
    margin-right: 1rem;

    opacity: 0.1;

    &:hover {
      opacity: 0.8;
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
  <div class="labels">
    <a class="back" href="/">
      <i class="fas fa-arrow-left" />
    </a>
    <h1>{name}</h1>
    {#if label}
      <h2>{label}</h2>
    {/if}
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
    <Sirets labelsFromId={labels} selected={siret} select={selectSiret} />
  </menu>
  <div class="dataviz">
    <Years {years} {valuePs} selected={year} select={selectYear} />
    <Summary {year} {budget} />
  </div>
</div>
