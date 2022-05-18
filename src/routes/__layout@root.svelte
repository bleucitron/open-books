<script lang="ts">
  import { page } from '$app/stores';

  import Nav from '$lib/Nav.svelte';
  import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';

  const version = __VERSION__;

  $: segment = $page.url.pathname.split('/')[1];
  $: isBudget = segment === 'budgets';
</script>

<GoogleAnalytics />
{#if !isBudget}
  <Nav path={segment || 'home'} />
{/if}

<div style:padding-top="5rem">
  <slot />
</div>

<footer>
  <div class="version" class:white={isBudget}>v{version}</div>
</footer>

<style lang="sass">
  :global(.icon)
    width: 1em
    height: 1em
    vertical-align: -0.125em

  footer
    position: fixed
    width: 100vw
    bottom: 0
    .version
      position: absolute
      bottom: 0.3rem
      left: 0.5rem
      font-size: 0.8rem

    .white
      color: #777

</style>
