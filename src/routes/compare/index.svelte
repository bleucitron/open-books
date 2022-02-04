<script lang="ts" context="module">
  import { makeCompareUrl } from '@utils';
  import type { LoadInput, LoadOutput } from '@sveltejs/kit';

  export async function load({
    url: { searchParams },
  }: LoadInput): Promise<LoadOutput> {
    const id1 = searchParams.get('id1');
    const id2 = searchParams.get('id2');
    const y = searchParams.get('year');
    const end = new Date().getFullYear();
    const defaultYear = end - 1;

    const year = parseInt(y) || defaultYear;

    if (id1 !== id2) {
      return {
        redirect: makeCompareUrl({
          id1,
          id2,
          year,
        }),
        status: 301,
      };
    }
  }
</script>
