<script>
  import { stores } from '@sapper/app';
  import Nav from './_components/Nav.svelte';

  export let segment;
</script>

{#if segment !== 'budgets'}
  <Nav path={segment || 'home'} />
{/if}

<slot />
