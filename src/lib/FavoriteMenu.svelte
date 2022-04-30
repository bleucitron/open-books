<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { FavoriteSearch } from '@interfaces';
  import { favorite } from '@stores/favorite';

  let open = false;

  function togglePopup(): void {
    open = !open;
  }

  function deleteFavorite(): void {
    favorite.clear();
  }

  function createUrl({ name, insee, sirens }: FavoriteSearch): string {
    const params = `name=${name}&insee=${insee}&sirens=${sirens.join(',')}`;
    return '/budgets?' + params;
  }
</script>

<div class="FavoriteMenu">
  <div class="toggle" on:click={togglePopup}>
    <Icon id="star" />
  </div>
  <div class="popup" class:open>
    {#if $favorite.length === 0}
      <p class="empty">Vous n'avez pas encore de favori</p>
    {:else}
      <div class="delete" on:click={deleteFavorite}>
        <Icon id="trash-2" />
      </div>
      <h2 class="title">Mes favoris :</h2>
      <ul class="list">
        {#each Object.entries($favorite) as [key, favoriteItem]}
          <li class="item">
            <a href={createUrl(favoriteItem)}>{favoriteItem.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="sass">
  .FavoriteMenu
    display: flex
    align-items: center
    position: relative

    .toggle
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer
      transition: color 0.3s ease-in-out

      &:hover
        color: coral

    .popup
      position: absolute
      top: calc(100% + 2px)
      right: -10px
      color: black
      width: 200px
      border: 1px solid black
      border-radius: 12px
      transition: all 0.3s
      opacity: 0
      visibility: hidden
      padding: 15px
      z-index: 1000
      background-color: white

      &.open
        opacity: 1
        visibility: visible

      .delete
        position: absolute
        right: 15px
        top: 15px
        cursor: pointer
        transition: color 0.3s ease-in-out

        &:hover
          color: coral

      .title
        margin-bottom: 10px
        font-size: 1.1em

      .list
        margin: 0
        font-size: 0.9em
        list-style-type: disc

        .item
          list-style: none
          &:hover
            color: coral

      .empty
        text-align: center
</style>
