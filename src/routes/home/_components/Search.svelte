<script lang="ts">
  import type { City } from '@interfaces';
  import Icon from '$lib/Icon.svelte';
  import Suggestions from './Suggestions.svelte';
  import { getCities } from '@api';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const selected: City = undefined;

  let cities: City[] = null;
  let value = '';
  $: if (selected) {
    value = selected.nom;
  }

  function reset(): void {
    value = '';
    cities = null;
  }

  function select(event: CustomEvent): void {
    let city = event.detail.city;
    if (!city) {
      city = cities[0];
    }
    dispatch('select', {
      city,
    });
    reset();
  }

  async function handleInput(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const text = target.value;
    if (text === '') {
      cities = null;
    }
    cities = await getCities(text);
  }

  function handleKey(e: KeyboardEvent): void {
    const keyPressed = e.key;
    if (keyPressed !== 'Escape') {
      return;
    }

    cities = null;
  }
</script>

<div class="Search">
  <div class="searchbar" class:open={cities}>
    <Icon id="search" />
    <input
      bind:value
      on:input={handleInput}
      on:keydown={handleKey}
      class="search-input"
      placeholder="Entrez le nom d'une commune"
    />
    {#if value}
      <span class="reset" on:click={reset}>
        <Icon id="x" />
      </span>
    {/if}
  </div>
  {#if cities}
    <Suggestions
      suggestions={cities}
      on:enterPress={select}
      on:click={select}
    />
  {/if}
</div>

<style lang="scss">
  * {
    color: white;
  }

  .Search {
    position: relative;
    max-width: 40rem;
    width: 100%;
    height: fit-content;
  }

  .searchbar {
    display: flex;
    background: #444;
    color: white;
    align-items: center;
    border-color: white;

    border-radius: 1rem;

    &.open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

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
    padding: 0.8rem;
    padding-left: 0;
    outline: none;
    font-size: 1.3rem;
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
