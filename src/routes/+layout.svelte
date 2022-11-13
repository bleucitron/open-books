<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$lib/Header.svelte';
  import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';

  const version = __VERSION__;

  $: segment = $page.url.pathname.split('/')[1];
  $: isBudget = segment === 'budgets';
</script>

<GoogleAnalytics />

<Header />

<div class="slot-container">
  <slot />
</div>

<footer>
  <div class="version" class:white={isBudget}>v{version}</div>
</footer>

<style lang="sass">
  .slot-container
    padding-top: $headerHeight

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
