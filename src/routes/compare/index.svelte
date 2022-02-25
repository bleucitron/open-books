<script lang="ts" context="module">
  import { makeCompareUrl } from '@utils';
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';

  export async function load({
    url: { searchParams },
  }: LoadInput): Promise<LoadOutput> {
    const siret = searchParams.get('siret');
    const y = searchParams.get('year');
    const end = new Date().getFullYear();
    const defaultYear = end - 1;

    const [id1, id2] = siret.split(',');

    const year = parseInt(y) || defaultYear;

    if (!siret) {
      return {
        redirect: makeCompareUrl({
          id1,
          id2,
          year,
        }),
        status: 301,
      };
    }

    return {
      props: {
        firstId: parseInt(id1),
        secondId: parseInt(id2),
        currentYear: year,
      },
    };
  }
</script>

<script lang="ts">
  export let firstId: number;
  export let secondId: number;
  export let currentYear: number;
</script>

<p>{firstId}, {secondId}, {currentYear}</p>
