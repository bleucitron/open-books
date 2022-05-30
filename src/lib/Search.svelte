<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { City } from '@interfaces';
  import { navigating } from '$app/stores';
  import Icon from '$lib/Icon.svelte';
  import Suggestions from '$lib/Suggestions.svelte';
  import Spinner from '$lib/Spinner.svelte';
  import { getCities } from '@api';
  import { isSiret } from '@utils/siren';

  const dispatch = createEventDispatcher();

  const selected: City = undefined;
  let showSuggestions = false;

  let cities: City[] = null;
  let value = '';
  let loading = false;
  let input: HTMLInputElement;
  let error = false;

  function reset(): void {
    value = '';
    cities = null;
  }

  function select({ detail }: CustomEvent): void {
    dispatch('select', { city: detail });
  }

  $: if (!$navigating) reset();

  async function handleInput({ target }: Event): Promise<void> {
    loading = false;
    error = false;

    const { value } = target as HTMLInputElement;

    const isText = Number.isNaN(Number(value));
    if (!isText) {
      showSuggestions = false;
      return;
    }

    cities = await getCities(value);

    if (cities?.length) showSuggestions = true;
  }

  function handleKey({ key, target }: KeyboardEvent): void {
    if (key === 'Escape') {
      showSuggestions = false;
      input.blur();
      return;
    }

    if (key === 'Enter') {
      const { value } = target as HTMLInputElement;
      const valueWithoutSpace = value.replace(/ /g, '');

      if (isSiret(valueWithoutSpace)) {
        dispatch('select', { siret: valueWithoutSpace });
        return;
      }
    }
  }

  $: if (selected) {
    value = selected.nom;
  }

  $: if (!value) {
    cities = null;
  }
</script>

<div class="Search">
  <div class="searchbar" class:open={showSuggestions && cities?.length}>
    <Icon id="search" />
    <input
      bind:value
      bind:this={input}
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
      {#if loading}
        <span on:click={() => (loading = false)}>
          <Spinner inline />
        </span>
      {:else}
        <span class="reset" on:click={reset}>
          {#if !showSuggestions && $navigating}
            <Spinner />
          {:else}
            <Icon id="x" />
          {/if}
        </span>
      {/if}
    {/if}
  </div>
  {#if error}
    <div class="error">Introuvable</div>
  {:else if cities && showSuggestions}
    <Suggestions suggestions={cities} on:select={select} />
  {/if}
</div>

<style lang="sass">
  .Search
    position: relative
    max-width: 40rem
    width: 100%
    height: fit-content
    font-size: 1.3rem

    *
      color: $grey-lighter

    &:focus-within
      .searchbar
        background: $grey-darker
      *
        color: $grey-lightest

  .searchbar
    display: flex
    background: $grey-dark
    align-items: center
    border-color: white

    border-radius: 0.8em

    &.open
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0

    :global(.Icon)
      margin: 0 0.7em
      font-size: 1.3em


    *
      display: flex
      justify-content: center
      align-items: center

    .reset :global(.Icon)
      cursor: pointer

  input
    flex: 1 0
    padding: 0.6em
    padding-left: 0
    outline: none
    font-size: 1.3em
    background: transparent
    border: none
    border-bottom: 1px solid transparent

    &::placeholder
      color: $grey

  .error
    position: absolute
    top: 100%
    width: 100%
    font-size: 0.7em
    color: #e73737
    text-align: center

  @media (max-width: 480px)
    input
      font-size: 1em
</style>
