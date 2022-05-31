<script lang="ts">
  import Header from '$lib/Header.svelte';
</script>

<Header />

<div class="slot-container">
  <slot />
</div>

<style lang="sass">
  .slot-container
    padding-top: $headerHeight
</style>
