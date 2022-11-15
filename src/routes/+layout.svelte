<script lang="ts">
  import { page } from '$app/stores';
  import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';

  const version = __VERSION__;

  $: segment = $page.url.pathname.split('/')[1];
  $: isBudget = segment === 'commune';
</script>

<GoogleAnalytics />

<slot />

<footer>
  <div class="version" class:white={isBudget}>v{version}</div>
</footer>

<style lang="sass">
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
