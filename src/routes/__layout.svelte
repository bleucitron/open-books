<script lang="ts">
  import { page } from '$app/stores';

  import Nav from '$lib/Nav.svelte';
  import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';
  import Footer from '$lib/Footer.svelte';

  $: segment = $page.path.split('/')[1];
</script>

<GoogleAnalytics />
<div class="page">
  {#if segment !== 'budgets'}
    <Nav path={segment || 'home'} />
  {/if}

  <slot />

  {#if segment !== 'budgets'}
    <Footer />
  {/if}
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
