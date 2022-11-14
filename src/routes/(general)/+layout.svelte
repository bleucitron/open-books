<script lang="ts">
  import Header from '$lib/Header.svelte';
</script>

<Header />

<main>
  <slot />
</main>

<style lang="sass">
  main
    padding-top: $headerHeight
</style>
