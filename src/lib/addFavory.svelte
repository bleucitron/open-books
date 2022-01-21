<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import { favory } from '@stores/favorites';

  export let name: string;
  export let insee: string;
  export let sirens: string[];

  function addFavory(name: string, insee: string, sirens: string[]): void {
    favory.addItem({ name, insee, sirens });
  }
</script>

<div class="add-favory-wrapper">
  <div class="toggle-history" on:click={() => addFavory(name, insee, sirens)}>
    <Icon id="star" />
  </div>
</div>

<style lang="scss">
</style>
