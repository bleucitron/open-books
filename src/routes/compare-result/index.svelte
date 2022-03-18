<script lang="ts" context="module">
  import { makeCompareUrl } from '@utils';
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';
  import { getCities } from '@api';
  import { fillBudgetBySiret } from '../budgets/cache';
  import type { Budget } from '@interfaces';
  import { compareCities } from '@stores/compare_cities';
  export async function load({
    url: { searchParams },
  }: LoadInput): Promise<LoadOutput> {
    const sirets = searchParams.get('sirets');
    const cities = searchParams.get('cities');
    const y = searchParams.get('year');
    const end = new Date().getFullYear();
    const defaultYear = end - 1;
    const [siret1, siret2] = sirets.split(',');
    const [city1, city2] = cities.split(',');
    const year = parseInt(y) || defaultYear;

    if (!sirets) {
      return {
        redirect: makeCompareUrl({
          siret1,
          siret2,
          year,
          city1,
          city2,
        }),
        status: 301,
      };
    }
    const cityObject1 = (await getCities(city1.toLowerCase()))[0];
    const cityObject2 = (await getCities(city2.toLowerCase()))[0];

    const budget1 = (
      await Promise.all(fillBudgetBySiret(siret1, [year], cityObject1))
    )[0];
    const budget2 = (
      await Promise.all(fillBudgetBySiret(siret2, [year], cityObject2))
    )[0];

    return {
      props: {
        firstId: parseInt(siret1),
        secondId: parseInt(siret2),
        currentYear: year,
        firstCity: city1,
        secondCity: city2,
        budget1,
        budget2,
      },
    };
  }
</script>

<script lang="ts">
  import City from '@stores/city';

  export let firstId: number;
  export let secondId: number;
  export let currentYear: number;
  export let firstCity: string;
  export let secondCity: string;
  export let budget1: Budget;
  export let budget2: Budget;
  let citiesChoosen: Array<City> = [];

  compareCities.subscribe(value => (citiesChoosen = value));
  console.log('Siren 1', budget1);
  console.log('Siren 2', budget2);
  console.log(citiesChoosen);
  const formatBudget = (budgetValue: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(budgetValue);
  };
</script>

<p>Budget de {budget1.city}: {formatBudget(budget1.obnetcre)}</p>
<p>Budget de {budget2.city}: {formatBudget(budget2.obnetcre)}</p>
<p>
  Difference : {formatBudget(Math.abs(budget1.obnetcre - budget2.obnetcre))}
</p>
