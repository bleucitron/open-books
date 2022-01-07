<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { Favorite } from '@interfaces';
  import { favorite } from '@stores/favorite';
  import { browser } from '$app/env';

  export let params: Favorite;
  export let dropdown: boolean;

  let isOpen = false;
  let isFav = false;

  $: if (browser) {
    if (params.insee in $favorite) isFav = true;
  }

  function createUrl(settings: Favorite): string {
    const q = [];
    if (settings.name) q.push('name=' + settings.name);
    if (settings.insee) q.push('insee=' + settings.insee);
    if (settings.sirens && settings.sirens.length)
      q.push('sirens=' + settings.sirens.join(','));

    return '/budgets?' + q.join('&');
  }

  function togglePopup(): void {
    isOpen = !isOpen;
  }
  function closePopup(): void {
    isOpen = false;
  }

  function toggleFav(): void {
    isFav = !isFav;
    favorite.toggleItem(params, isFav);
  }
</script>

<div class="fav-wrapper">
  <div class="toggle-fav" on:click={toggleFav}>
    <Icon id="heart" filled={isFav} color="white" size="1.3em" />
  </div>
  {#if dropdown}
    <div class="toggle-popup {isOpen ? 'open' : ''}" on:click={togglePopup}>
      <Icon id="triangle" filled color="white" size=".8em" />
    </div>
    <div class="popup {isOpen ? 'open' : ''}">
      <div class="close-popup" on:click={closePopup}>
        <Icon id="x-circle" color="white" size="1.3em" />
      </div>
      <h2 class="favorite-title">Mes favoris :</h2>
      <ul class="favorite-list">
        {#each Object.entries($favorite) as [key, favoriteItem]}
          <li class="favorite-item">
            <a href={createUrl(favoriteItem)}>{favoriteItem.name}</a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style lang="scss">
  .fav-wrapper {
    margin: 0 10px;
    position: relative;

    .toggle-fav {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .toggle-popup {
      position: absolute;
      bottom: -8px;
      right: -5px;
      transition: all 0.3s;
      transform: rotate(180deg);
      cursor: pointer;

      &.open {
        transform: rotate(0);
      }
    }

    .popup {
      position: absolute;
      top: calc(100% + 0px);
      right: -10px;
      background-color: #666;
      width: 200px;
      min-height: 200px;
      border: 1px solid black;
      transition: all 0.3s;
      opacity: 0;
      visibility: hidden;
      padding: 20px;
      z-index: 1000;

      &.open {
        opacity: 1;
        visibility: visible;
      }

      .close-popup {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }

      .favorite-title {
        margin-bottom: 10px;
      }

      .favorite-list {
        margin: 0;

        .favorite-item {
          font-size: 1.2em;

          &:hover {
            color: coral;
          }
        }
      }
    }
  }
</style>
