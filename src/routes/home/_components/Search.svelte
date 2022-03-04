<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { City } from '@interfaces';
  import Icon from '$lib/Icon.svelte';
  import Suggestions from './Suggestions.svelte';
  import { getCities } from '@api';

  const dispatch = createEventDispatcher();

  const selected: City = undefined;
  let showSuggestions = false;

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

  async function handleInput({ target }: Event): Promise<void> {
    const { value } = target as HTMLInputElement;
    if (value === '') {
      showSuggestions = false;
      return;
    }
    showSuggestions = true;
    cities = await getCities(value);
  }

  function handleKey({ key }: KeyboardEvent): void {
    if (key === 'Escape') {
      showSuggestions = false;
    }
  }
</script>

<div class="Search">
  <div class="searchbar" class:open={showSuggestions && cities}>
    <Icon id="search" />
    <input
      bind:value
      on:focus={() => {
        if (cities?.length > 0) {
          showSuggestions = true;
        }
      }}
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
  {#if cities && showSuggestions}
    <Suggestions suggestions={cities} on:select={select} />
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
    font-size: 1.3rem;
  }

  .searchbar {
    display: flex;
    background: #444;
    color: white;
    align-items: center;
    border-color: white;

    border-radius: 0.8em;

    &.open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    :global(.Icon) {
      margin: 0 0.7em 0 0.9em;
      font-size: 1.3em;
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
    padding: 0.7em;
    padding-left: 0;
    outline: none;
    font-size: 1.3em;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;

    &::placeholder {
      color: #777;
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 1em;
    }
  }
</style>
