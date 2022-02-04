<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { HistorySearch } from '@interfaces';
  import { history } from '@stores/history';

  let isOpen = false;

  function togglePopup(): void {
    isOpen = !isOpen;
  }

  function deleteHistory(): void {
    history.clear();
  }

  function createUrl(settings: HistorySearch): string {
    const q = [];
    if (settings.name) q.push('name=' + settings.name);
    if (settings.insee) q.push('insee=' + settings.insee);
    if (settings.sirens && settings.sirens.length)
      q.push('sirens=' + settings.sirens.join(','));
    return '/budgets?' + q.join('&');
  }
</script>

<div class="history-wrapper">
  <div class="toggle-history" on:click={togglePopup}>
    <Icon id="clock" />
  </div>
  <div class="popup {isOpen ? 'open' : ''}">
    {#if $history.length === 0}
      <p class="history-empty">Historique vide</p>
    {:else}
      <div class="delete-history" on:click={deleteHistory}>
        <Icon id="trash-2" />
      </div>
      <h2 class="history-title">Mon historique :</h2>
      <ul class="history-list">
        {#each Object.entries($history) as [key, historyItem]}
          <li class="history-item">
            <a href={createUrl(historyItem)}>{historyItem.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="scss">
  .history-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 12px;
    .toggle-history {
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
      border: 1px solid black;
      border-radius: 12px;
      transition: all 0.3s;
      opacity: 0;
      visibility: hidden;
      padding: 15px;
      z-index: 1000;
      background-color: white;
      &.open {
        opacity: 1;
        visibility: visible;
      }
      .delete-history {
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        &:hover {
          color: coral;
        }
      }
      .history-title {
        margin-bottom: 10px;
        font-size: 1.1em;
      }
      .history-list {
        margin: 0;
        font-size: 0.9em;
        list-style-type: disc;
        .history-item {
          list-style: none;
          &:hover {
            color: coral;
          }
        }
      }
      .history-empty {
        text-align: center;
      }
    }
  }
</style>
