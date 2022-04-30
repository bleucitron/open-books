<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import { favorite } from '@stores/favorite';
  import { onMount } from 'svelte';

  export let name: string;
  export let insee: string;
  export let sirens: string[];
  let isFavorite: boolean;

  function toggleFavorite(name: string, insee: string, sirens: string[]): void {
    if (!isFavorite) {
      favorite.addItem({ name, insee, sirens });
      isFavorite = true;
    } else {
      favorite.removeItem(name);
      isFavorite = false;
    }
  }

  onMount(async () => {
    if (!favorite.checkItem(name)) {
      isFavorite = false;
    } else {
      isFavorite = true;
    }
  });
</script>

<div
  class="FavoriteToggle"
  on:click={() => toggleFavorite(name, insee, sirens)}
>
  <Icon id="star" filled={isFavorite} color="yellow" />
</div>

<style lang="sass">
  .FavoriteToggle
    display: flex
    align-items: center
    justify-content: center

    &:hover
      color: coral
      cursor: pointer
</style>
