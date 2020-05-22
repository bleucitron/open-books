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
  import { getRecords } from '../../api';
  import { makeBudget, makeId, orderRecordsBySiret } from './_utils';
  import Labels from './_components/Labels.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';
  import Nav from '../_components/Nav.svelte';
  import Spinner from '../_components/Spinner.svelte';

  export let sirens;
  export let siret;
  export let year;
  export let insee;
  export let name;

  let budgetById = {};
  let label;

  function selectSiret(s) {
    goto(`/budgets?name=${name}&insee=${insee}&siret=${s}&year=${year}`);

    budgetPs = years.map(y => {
      const id = makeId(s, y);
      return Promise.resolve(budgetById[id]);
    });
  }

  function selectYear(y) {
    goto(`/budgets?name=${name}&insee=${insee}&siret=${siret}&year=${y}`);
  }

  function findSimilarBudget(siret) {
    return Object.values(budgetById).find(
      budget => budget && budget.siret === siret,
    );
  }

  const cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });

  let budgetPs = years.map(year =>
    getRecords({ ident: [siret], year })
      .catch(() => [])
      .then(records => {
        const b = makeBudget({ city: name, siret, year, records });

        const id = makeId(siret, year);
        budgetById[id] = b;

        return b;
      }),
  );

  const otherBudgetPs = [...years].reverse().map(year =>
    getRecords({ siren: sirens, year })
      .catch(() => [])
      .then(records => {
        const data = orderRecordsBySiret(records).map(
          ({ siret: s, records }) => {
            const b = makeBudget({
              city: name,
              siret: s,
              year,
              records,
            });

            const id = makeId(s, year);
            if (s !== siret) budgetById[id] = b;
          },
        );
      }),
  );

  const loadingP = Promise.all([...budgetPs, ...otherBudgetPs]);
  loadingP.then(() =>
    sirets.forEach(siret => {
      years.forEach(year => {
        const id = makeId(siret, year);
        if (!(id in budgetById)) budgetById[id] = null;
      });
    }),
  );

  $: yearIndex = years.findIndex(y => y === year);

  $: sirets = [
    ...new Set(
      Object.values(budgetById)
        .filter(b => b)
        .map(b => b.siret),
    ),
  ].sort();

  $: labels = sirets.map(s => {
    const id = makeId(s, year);
    const budget = budgetById[id];

    return budget || findSimilarBudget(s);
  });

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.credit),
  );

  $: id = makeId(siret, year);
  $: budget = budgetById[id];
  $: {
    if (budget) label = budget.label;
    else {
      const similarBudget = findSimilarBudget(siret);
      if (similarBudget) label = similarBudget.label;
    }
  }
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
    <Labels {labels} {loadingP} selected={siret} select={selectSiret} />
  </menu>
  <div class="dataviz">
    <Years {years} {valuePs} selected={year} select={selectYear} />
    <Summary {year} {budget} />
  </div>
</div>
