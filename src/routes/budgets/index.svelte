<script lang="ts" context="module">
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';
  import { getSiretsFromInsee, getCity } from '@api';
  import { extractSirens } from '@api/utils/siren';

  const start = 2012;
  const end = new Date().getFullYear();
  const defaultYear = end - 1;
  const years = [...Array(end - start + 1).keys()].map(x => x + start);

  export async function load({
    page: { query },
  }: LoadInput): Promise<LoadOutput> {
    const name = query.get('name');
    const insee = query.get('insee');
    const y = query.get('year');
    const sirenString = query.get('sirens');
    let siret = query.get('siret');

    let sirens = sirenString?.split(',');

    const year = parseInt(y) || defaultYear;

    if (!siret || !sirens) {
      const siretsFromInsee = await getSiretsFromInsee(name, insee);
      sirens = extractSirens(siretsFromInsee);

      const sirets = siretsFromInsee
        .filter(e => e.etablissementSiege)
        .map(e => e.siret)
        .sort();

      siret = sirets[0];

      return {
        redirect: makeBudgetUrl({
          name,
          insee,
          siret,
          sirens,
          year,
        }),
        status: 301,
      };
    }

    return {
      props: {
        sirens,
        currentSiret: siret,
        currentYear: year,
        insee,
        name,
      },
    };
  }

  const budgetCache: BudgetMap = {};
</script>

<script lang="ts">
  import { goto } from '$app/navigation';

  import city from '@stores/city';
  import { getRecords } from '@api';
  import {
    makeBudget,
    makeId,
    makeBudgetUrl,
    orderRecordsBySiret,
  } from '@utils';

  import type { Budget, BudgetMap, City, BudgetRecord } from '@interfaces';

  import Icon from '$lib/Icon.svelte';
  import Spinner from '$lib/Spinner.svelte';
  import Labels from './_components/Labels.svelte';
  import Years from './_components/Years.svelte';
  import Summary from './_components/Summary.svelte';

  export let sirens: string[];
  export let currentSiret: string;
  export let currentYear: number;
  export let insee: string;
  export let name: string;
  // let type: string;
  // let fonction: string;

  let budgetById: BudgetMap = {};

  // TODO: remove after check
  $: if (name !== $city?.nom) $city = { nom: name, code: insee };
  $: if ($city) budgetById = {};

  function fillBudgetBySiret(
    siret: string,
    years: number[],
  ): Promise<Budget>[] {
    const budgets: Promise<Budget>[] = [];

    years.forEach(currYear => {
      const id = makeId(siret, currYear);

      const p =
        id in budgetCache
          ? Promise.resolve(budgetCache[id])
          : getRecords({
              ident: [siret],
              year: currYear,
            })
              .catch(() => [])
              .then((records: BudgetRecord[]) => {
                const b = makeBudget({
                  city: name,
                  siret,
                  year: currYear,
                  records,
                });

                budgetCache[id] = b;
                budgetById[id] = b;

                return b;
              });

      budgets.push(p);
    });

    return budgets;
  }

  function fillBudgetBySirens(
    sirens: string[],
    years: number[],
  ): Promise<Budget[]>[] {
    const sirensToFetch: string[] = [];
    let siretsInCache: string[] = [];

    sirens.forEach(siren => {
      const sirets = Object.keys(budgetCache).filter(s => s.startsWith(siren));

      if (sirets.length) {
        siretsInCache = [...siretsInCache, ...sirets];
      } else {
        sirensToFetch.push(siren);
      }
    });

    const needToFetch = sirensToFetch.length > 0;

    return [...years].reverse().map(year => {
      const cached = siretsInCache
        .map(s => makeId(s, year))
        .map(id => budgetCache[id]);

      return needToFetch
        ? Promise.all([
            Promise.resolve(cached),
            getRecords({ siren: sirensToFetch, year })
              .catch(() => [])
              .then((records: BudgetRecord[]) =>
                orderRecordsBySiret(records).map(({ siret, records }) => {
                  const b = makeBudget({
                    city: name,
                    siret,
                    year,
                    records,
                  });
                  const id = makeId(siret, year);
                  if (siret !== currentSiret && !(id in budgetCache)) {
                    budgetCache[id] = b;
                    budgetById[id] = b;
                  }

                  return b;
                }),
              ),
          ]).then(budgets => budgets.flat())
        : Promise.resolve(cached);
    });
  }

  function selectSiret(s: string): void {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: s,
      sirens,
      year: currentYear,
    });

    goto(url);
  }

  function selectYear(y: number): void {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: currentSiret,
      sirens,
      year: y,
    });

    goto(url);
  }

  $: findSimilarBudget = function (siret: string) {
    return Object.values(budgetById).find(
      budget => budget && budget.siret === siret,
    );
  };

  $: findSimilarLabel = function () {
    const id = makeId(currentSiret, currentYear);
    const budget = budgetById[id] || findSimilarBudget(currentSiret);
    return budget?.label;
  };

  $: cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then((result: City) => {
        city.set(result);
        return result;
      });

  $: budgetPs = fillBudgetBySiret(currentSiret, years);
  $: otherBudgetPs = fillBudgetBySirens(sirens, [...years].reverse());

  $: allPs = [...budgetPs, ...otherBudgetPs] as Promise<unknown>[];

  $: loadingP = Promise.all(allPs);

  $: sirets = [
    ...new Set(
      Object.values(budgetById)
        .filter(b => b)
        .map((b: Budget) => b.siret),
    ),
  ].sort();

  $: labels = sirets
    .map(s => {
      const id = makeId(s, currentYear);
      const budget = budgetById[id];

      return budget || findSimilarBudget(s);
    })
    .filter(l => l) as Budget[];

  $: valuePs = budgetPs.map(budgetP =>
    budgetP.then(budget => budget && budget.obnetcre),
  );

  $: yearIndex = years.findIndex(y => y === currentYear);
  $: budgetP = budgetPs[yearIndex];
  // $: console.log(budgetP);
  $: label = findSimilarLabel();
</script>

<svelte:head>
  {#await cityP}
    <title>{`Budgets pour ${name}`}</title>
  {:then city}
    {#if city}
      <title>{`Budgets pour ${name} (${city.departement.code})`}</title>
    {/if}
  {:catch}
    <title>{`Budgets pour ${name}`}</title>
  {/await}
</svelte:head>

<header>
  <a class="home" href="/">
    <Icon id="book-open" />
  </a>
  <div class="info">
    <div class="labels">
      <h1>{name}</h1>

      {#if label}
        <h2>{label}</h2>
      {/if}

      <!-- TODO: remove after check -->
      <a href="/budgets?name=Annecy&insee=74010">Annecy</a>
    </div>

    <div class="departement">
      {#await cityP}
        <Spinner />
      {:then city}
        {#if city}
          <div>{`${city.departement.code} - ${city.departement.nom}`}</div>
        {/if}
      {:catch error}
        <div style="color: red">{error}</div>
      {/await}
    </div>
  </div>
</header>

<div class="content">
  <menu>
    <Labels {labels} {loadingP} selected={currentSiret} select={selectSiret} />
  </menu>
  <div class="dataviz">
    <Years {years} {valuePs} selected={currentYear} select={selectYear} />
    <Summary year={currentYear} {budgetP} />
  </div>
</div>

<style lang="scss">
  header {
    padding: 0 0.5rem;
    height: 3rem;
    background: #151515;
    color: white;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info {
      flex: 1 0;
      display: flex;
      justify-content: space-between;
    }

    .home {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 1.5rem;
      margin-right: 1.5rem;
      color: #444;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: coral;
      }
    }

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
      align-items: flex-end;
      opacity: 0.3;
    }
  }

  menu {
    margin: 0;
    color: white;
    background: #333;
    display: flex;
    padding: 1rem;
    padding-right: 1.5rem;
  }

  .content {
    flex: 1 0;
    display: flex;
    flex-flow: row;
    overflow: hidden;
  }

  .dataviz {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: #333;
  }
</style>
