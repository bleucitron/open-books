<script lang="ts">
  import Nav from './_components/Nav.svelte';

  export let segment: string;
</script>

{#if segment !== 'budgets'}
  <Nav path={segment || 'home'} />
{/if}

<slot />
