<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import { favorite } from '@stores/favorite';
  import { onMount } from 'svelte';

  export let name: string;
  export let insee: string;
  export let sirens: string[];
  let isFavorite: boolean;
  $: isFavoriteTest = isFavorite;

  function addFavorite(name: string, insee: string, sirens: string[]): void {
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

<div class="add-favorite-wrapper">
  <div class="toggle-history" on:click={() => addFavorite(name, insee, sirens)}>
    <Icon id="star" filled={isFavoriteTest} color="yellow" />
  </div>
</div>

<style lang="scss">
</style>
