<script>
  import { stores } from '@sapper/app';
  import Nav from './_components/Nav.svelte';

  const { page } = stores();

  $: path = $page.path;
</script>

{#if path !== '/budgets'}
  <Nav {path} />
{/if}

<slot />
