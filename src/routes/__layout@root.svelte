<script lang="ts">
  import Nav from '$lib/Nav.svelte';
</script>

<Nav path="home" />

<div class="root-layout">
  <slot />
</div>

<style lang="sass">
  .root-layout
    padding-top: $headerHeight
</style>
