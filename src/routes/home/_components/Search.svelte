<script lang="ts">
  import { onMount } from 'svelte';

  import type { City } from '@interfaces';

  import Icon from '../../_components/Icon.svelte';

  export let search: (s: string) => void;
  export let clear: () => void;
  export let selected: City = undefined;

  let value = '';
  $: if (selected) {
    value = selected.nom;
  }

  onMount(async () => {
    search(value);
  });

  function reset(): void {
    value = '';
    clear();
  }

  function handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const text = target.value;
    search(text);
    value = text;
  }
</script>

<div class="Search">
  <div class="searchbar">
    <Icon id="search" />

    <input
      {value}
      on:input={handleInput}
      placeholder="Entrez le nom d'une commune"
    />
    {#if value}
      <span class="reset" on:click={reset}>
        <Icon id="x" />
      </span>
    {/if}
  </div>
  <slot />
</div>

<style lang="scss">
  * {
    color: white;
  }

  .Search {
    border-radius: 1rem;
    overflow: hidden;
    margin: 2rem auto;
    max-width: 75%;
    width: 50rem;
    height: fit-content;
  }

  .searchbar {
    display: flex;
    background: #444;
    color: white;
    align-items: center;
    border-color: white;

    :global(.Icon) {
      margin: 0 1rem;
      font-size: 1.3rem;
    }

    &:focus-within {
      background: #333;
    }

    * {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .reset :global(.Icon) {
      cursor: pointer;
    }
  }

  input {
    flex: 1 0;
    padding: 1rem;
    padding-left: 0;
    outline: none;
    font-size: 2rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;

    &::placeholder {
      color: #777;
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 1rem;
    }
  }
</style>
