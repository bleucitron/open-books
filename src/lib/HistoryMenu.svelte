<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { HistorySearch } from '@interfaces';
  import { history } from '@stores/history';

  let open = false;

  function togglePopup(): void {
    open = !open;
  }

  function deleteHistory(): void {
    history.clear();
  }

  function createUrl({ name, insee, sirens }: HistorySearch): string {
    const params = `name=${name}&insee=${insee}&sirens=${sirens.join(',')}`;
    return '/budgets?' + params;
  }
</script>

<div class="HistoryMenu">
  <div class="toggle" on:click={togglePopup}>
    <Icon id="clock" />
  </div>
  <div class="popup" class:open>
    {#if $history.length === 0}
      <p class="empty">Historique vide</p>
    {:else}
      <div class="delete" on:click={deleteHistory}>
        <Icon id="trash-2" />
      </div>
      <h2 class="title">Mon historique :</h2>
      <ul class="list">
        {#each Object.entries($history) as [key, historyItem]}
          <li class="item">
            <a href={createUrl(historyItem)}>{historyItem.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="sass">
  .HistoryMenu
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
      width: 15rem
      border: 1px solid black
      border-radius: 12px
      transition: all 0.3s
      opacity: 0
      visibility: hidden
      padding: 1.2rem
      z-index: 1000
      background-color: white

      &.open
        opacity: 1
        visibility: visible

      .delete
        position: absolute
        right: 1rem
        top: 1rem
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
