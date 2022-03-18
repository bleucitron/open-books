<script lang="ts">
  import { page } from '$app/stores';

  import Nav from '$lib/Nav.svelte';
  import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';

  $: segment = $page.url.pathname.split('/')[1];
  $: isBudget = segment === 'budgets';
</script>

<GoogleAnalytics />
<div class="page">
  {#if !isBudget}
    <Nav path={segment || 'home'} />
  {/if}

  <slot />

  <footer>
    <div class="version" class:white={isBudget}>v{__VERSION__}</div>
  </footer>
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

  footer .version {
    position: absolute;
    bottom: 0.3rem;
    left: 0.5rem;
    font-size: 0.8rem;
  }
  footer .white {
    color: #777;
  }
</style>
