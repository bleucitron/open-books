<script lang="ts" context="module">
  import { makeCompareUrl } from '@utils';
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';
  import { getSiret } from '@api';
  export async function load({
    url: { searchParams },
  }: LoadInput): Promise<LoadOutput> {
    const sirets = searchParams.get('sirets');
    const cities = searchParams.get('cities');
    const y = searchParams.get('year');
    const end = new Date().getFullYear();
    const defaultYear = end - 1;
    const [id1, id2] = sirets.split(',');
    const [city1, city2] = cities.split(',');
    const year = parseInt(y) || defaultYear;

    //Mettre un vrai siret dans les params url
    const siren1 = await getSiret(id1);
    const siren2 = await getSiret(id2);

    if (!sirets) {
      return {
        redirect: makeCompareUrl({
          id1,
          id2,
          year,
          city1,
          city2,
        }),
        status: 301,
      };
    }

    return {
      props: {
        firstId: parseInt(id1),
        secondId: parseInt(id2),
        currentYear: year,
        firstCity: city1,
        secondCity: city2,
        siren1,
        siren2,
      },
    };
  }
</script>

<script lang="ts">
  export let firstId: number;
  export let secondId: number;
  export let currentYear: number;
  export let firstCity: string;
  export let secondCity: string;
  export let siren1;
  export let siren2;
  console.log('Siren 1', siren1);
  console.log('Siren 2', siren2);
</script>

<p>{firstId}, {secondId}, {currentYear}, {firstCity}, {secondCity}</p>
