<script lang="ts">
  import { fade } from 'svelte/transition';
  import Icon from '$lib/Icon.svelte';
  import type { LinkItem } from '@interfaces';
  import { buildParamString } from '@api/utils/misc';

  export let icon = 'clock';
  export let label = 'Liste';
  export let items: LinkItem[] = [];
  export let clear: () => void;

  let open = false;

  function togglePopup(): void {
    open = !open;
  }

  function createUrl({ name, ...item }: LinkItem): string {
    if (!item.insee) item.siret = name;

    const paramString = buildParamString(item);
    return '/budgets?' + paramString;
  }
</script>

<div class="PopupMenu" class:open on:mouseleave={() => (open = false)}>
  <div class="toggle" on:click={togglePopup}>
    <Icon id={icon} />
  </div>
  {#if open}
    <div class="content" transition:fade={{ duration: 200 }}>
      {#if items.length === 0}
        <p class="empty">Aucun élément</p>
      {:else}
        <h2 class="title">{label}</h2>
        <ul class="items">
          {#each items as item}
            <li class="item">
              <a href={createUrl(item)}>{item.name}</a>
            </li>
          {/each}
        </ul>
      {/if}
      <div class="delete" on:click={clear}>Effacer</div>
    </div>
  {/if}
</div>

<style lang="sass">
  .PopupMenu
    display: flex
    align-items: center
    position: relative
    height: 100%

    &.open
      .toggle
        color: coral

    .toggle
      position: relative
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer
      transition: color 0.3s ease-in-out
      z-index: 3

      &:hover
        color: coral

    .content
      position: absolute
      top: 100%
      right: -0.5rem
      border: 1px solid $grey-darkest
      padding: 0.5rem 0.75rem
      padding-bottom: 0
      z-index: 2
      background-color: white
      white-space: nowrap

    .title
      margin-bottom: 0.5rem
      margin-right: 2rem
      font-size: 1.1em

    .items
      margin: 0
      font-size: 0.9em
      list-style-type: disc

      .item
        list-style: none
        a:hover
          color: cornflowerblue

    .delete
      margin-top: 1rem
      margin-bottom: 0.3rem
      font-size: 0.8rem
      text-align: center
      cursor: pointer
      transition: color 0.3s ease-in-out

      &:hover
        color: coral
</style>
