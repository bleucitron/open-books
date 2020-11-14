<script lang="ts">
  import { onMount } from 'svelte';

  import type { City } from '../../../interfaces';

  export let search: (s: string) => void;
  export let clear: () => void;
  export let selected: City | null = null;

  let value = '';
  let focus = false;

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

  function setFocus(v: boolean): void {
    focus = v;
  }

  function handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const text = target.value;
    search(text);
    value = text;
  }
</script>

<div class="Search">
  <div class="searchbar" class:focus>
    <i class="fas fa-search" />
    <input
      {value}
      on:input={handleInput}
      on:focus={() => setFocus(true)}
      on:blur={() => setFocus(false)}
      placeholder="Entrez le nom d'une commune"
    />
    {#if value}
      <i class="fas fa-times" on:click={reset} />
    {/if}
  </div>
  <slot />
</div>

<style lang="scss">
  * {
    background: #444;
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
    border-color: white;

    * {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.focus {
      * {
        background: #333;
      }
    }
  }

  i {
    width: 2rem;
    padding: 0 2rem;
    font-size: 1.5rem;

    &.fa-times:hover {
      cursor: pointer;
    }
  }

  input {
    flex: 1 0;
    padding: 1rem;
    padding-left: 0;
    outline: none;
    font-size: 2rem;
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
