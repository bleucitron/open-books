<script lang="ts">
  import { page } from '$app/stores';

  import Nav from './_components/Nav.svelte';
  import GoogleAnalytics from './_components/GoogleAnalytics.svelte';

  $: segment = $page.path.split('/')[1];
</script>

<GoogleAnalytics />
<div class="page">
  {#if segment !== 'budgets'}
    <Nav path={segment || 'home'} />
  {/if}

  <slot />
</div>

<style class="scss">
  .page {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    overflow: hidden;
  }

  :global(.icon) {
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
  }
</style>
