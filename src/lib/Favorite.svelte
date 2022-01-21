<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { FavoriteSearch } from '@interfaces';
  import { favorite } from '@stores/favorite';

  let isOpen = false;

  function togglePopup(): void {
    isOpen = !isOpen;
  }

  function deleteFavorite(): void {
    favorite.clear();
  }

  function createUrl(settings: FavoriteSearch): string {
    const q = [];
    if (settings.name) q.push('name=' + settings.name);
    if (settings.insee) q.push('insee=' + settings.insee);
    if (settings.sirens && settings.sirens.length)
      q.push('sirens=' + settings.sirens.join(','));
    return '/budgets?' + q.join('&');
  }
</script>

<div class="favorite-wrapper">
  <div class="toggle-favorite" on:click={togglePopup}>
    <Icon id="star" />
  </div>
  <div class="popup {isOpen ? 'open' : ''}">
    {#if $favorite.length === 0}
      <p class="favorite-empty">Vous n'avez pas encore de favori</p>
    {:else}
      <div class="delete-favorite" on:click={deleteFavorite}>
        <Icon id="trash-2" />
      </div>
      <h2 class="favorite-title">Ma liste de favoris :</h2>
      <ul class="favorite-list">
        {#each Object.entries($favorite) as [key, favoriteItem]}
          <li class="favorite-item">
            <a href={createUrl(favoriteItem)}>{favoriteItem.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="scss">
  .favorite-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    .toggle-favorite {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color 0.3s ease-in-out;
      &:hover {
        color: coral;
      }
    }
    .popup {
      position: absolute;
      top: calc(100% + 2px);
      right: -10px;
      color: black;
      width: 200px;
      border: 2px solid black;
      border-radius: 5px;
      transition: all 0.3s;
      opacity: 0;
      visibility: hidden;
      padding: 20px;
      z-index: 1000;
      background-color: white;
      &.open {
        opacity: 1;
        visibility: visible;
      }
      .delete-favorite {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        &:hover {
          color: coral;
        }
      }
      .favorite-title {
        margin-bottom: 10px;
        font-size: 1.1em;
      }
      .favorite-list {
        margin: 0;
        font-size: 0.9em;
        list-style-type: disc;
        .favorite-item {
          &:hover {
            color: coral;
          }
        }
      }
      .favorite-empty {
        text-align: center;
      }
    }
  }
</style>
