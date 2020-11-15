<script lang="ts">
  import Nav from './_components/Nav.svelte';

  export let segment: string;
</script>

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
</style>
