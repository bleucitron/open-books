<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import type { City } from '@interfaces';
  import { navigating } from '$app/stores';
  import Icon from '$lib/Icon.svelte';
  import Suggestions from '$lib/Suggestions.svelte';
  import Spinner from '$lib/Spinner.svelte';
  import { getCities } from '@api';
  import { isSiret } from '@utils/siren';

  enum Mode {
    Search = 'search',
    Favs = 'bookmark',
    History = 'clock',
  }
  const duration = 200;
  const { Search, Favs, History } = Mode;

  const dispatch = createEventDispatcher();

  const modeById = {
    [Search]: {
      id: Search,
      label: 'Recherche',
    },
    [Favs]: {
      id: Favs,
      label: 'Favoris',
    },
    [History]: {
      id: History,
      label: 'Historique',
    },
  };

  const selected: City = undefined;

  let showMenu = false;
  let showSuggestions = false;
  let cities: City[] = null;
  let value = '';
  let loading = false;
  let input: HTMLInputElement;
  let error = false;
  let mode = Search;

  function reset(): void {
    value = '';
    cities = null;
    showMenu = false;
  }

  function select({ detail }: CustomEvent): void {
    dispatch('select', { city: detail });
  }

  async function handleInput({ target }: Event): Promise<void> {
    loading = false;
    error = false;
    showMenu = false;

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
    showMenu = false;

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

  function selectMode(id: Mode): void {
    mode = id;
    showMenu = false;
  }

  $: if (!$navigating) reset();

  $: if (selected) {
    value = selected.nom;
  }

  $: if (!value) {
    cities = null;
  }
  $: if (mode === Search) {
    input?.focus();
  }

  $: modes = Object.values(modeById).filter(m => m.id !== mode);
  $: currentMode = modeById[mode];
</script>

<div class="Search">
  <div class="searchbar" class:open={showSuggestions && cities?.length}>
    <menu
      on:mouseenter={() => (showMenu = !showMenu)}
      on:click={() => (showMenu = !showMenu)}
    >
      <button>
        <Icon id={mode} />
      </button>
      {#if showMenu}
        <ul in:slide={{ duration }}>
          {#each modes as { id, label } (id)}
            <button animate:flip={{ duration }} on:click={() => selectMode(id)}>
              <Icon {id} />
              {label}
            </button>
          {/each}
        </ul>
      {/if}
    </menu>
    {#if mode === Search}
      <input
        bind:value
        bind:this={input}
        on:focus={() => {
          showMenu = false;
          if (cities?.length > 0) {
            showSuggestions = true;
          }
        }}
        on:input={handleInput}
        on:keydown={handleKey}
        placeholder="Entrez le nom d'une commune"
      />
    {:else}
      <div class="mode">{currentMode.label}</div>
    {/if}
    {#if value}
      {#if loading}
        <button on:click={() => (loading = false)}>
          <Spinner />
        </button>
      {:else}
        <button class="reset" on:click={reset}>
          {#if !showSuggestions && $navigating}
            <Spinner />
          {:else}
            <Icon id="x" />
          {/if}
        </button>
      {/if}
    {/if}
  </div>
  {#if error}
    <div class="error">Introuvable</div>
  {:else if cities && showSuggestions && !showMenu}
    <Suggestions suggestions={cities} on:select={select} />
  {/if}
</div>

<style lang="sass">
  .Search
    position: relative
    max-width: 40rem
    width: 100%
    height: 4rem
    font-size: 1.3rem

    color: $grey-lighter
    input
      color: $grey-lighter

    &:focus-within
      .searchbar
        background: $grey-darker


      color: $grey-lightest
      input
        color: $grey-lightest

  .searchbar
    display: flex
    background: $grey-dark
    border-color: white

    border-radius: 0.8em

    &.open
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0

    :global(.Icon)
      margin: 0 0.7em
      font-size: 1.3em

    button
      display: flex
      justify-content: center
      align-items: center
      // height: 100%

    .reset :global(.Icon)
      cursor: pointer

    menu
      position: relative
      display: flex
      align-items: center
      justify-content: center

      ul
        position: absolute
        left: 0
        top: 100%

        color: $grey-dark

        button
          padding-block: 0.25em
          transition: color 0.3s ease-in-out

          &:hover
            color: cornflowerblue

  input, .mode
    flex: 1 0
    display: flex
    align-items: center
    padding: 0.6em
    padding-left: 0
    outline: none
    font-size: 1.3em
    line-height: 1.3em
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
