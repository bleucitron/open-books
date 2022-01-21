<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import { favorite } from '@stores/favorite';

  export let name: string;
  export let insee: string;
  export let sirens: string[];

  function addFavorite(name: string, insee: string, sirens: string[]): void {
    favorite.addItem({ name, insee, sirens });
  }
</script>

<div class="add-favorite-wrapper">
  <div class="toggle-history" on:click={() => addFavorite(name, insee, sirens)}>
    <Icon id="star" />
  </div>
</div>

<style lang="scss">
</style>
