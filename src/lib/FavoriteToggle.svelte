<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import favorites from '@stores/favorites';

  export let name: string;
  export let insee: string;
  export let data: unknown;

  function toggleFavorite(): void {
    if (!isFavorite) {
      favorites.addItem({ name, insee, data });
    } else {
      favorites.removeItem(name);
    }
  }

  $: isFavorite = !!$favorites.find(favorite => favorite.name === name);
</script>

<button class="FavoriteToggle" on:click={toggleFavorite}>
  <Icon
    id="bookmark"
    filled={isFavorite}
    color={isFavorite ? 'cornflowerblue' : 'currentColor'}
  />
</button>

<style lang="sass">
  .FavoriteToggle
    display: flex
    align-items: center
    justify-content: center
    align-self: flex-end

    &:hover
      color: cornflowerblue
</style>
