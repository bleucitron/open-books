<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { City, LinkItem } from '@interfaces';
  import { navigating } from '$app/stores';
  import Icon from '$lib/Icon.svelte';
  import Suggestions, { type Suggestion } from '$lib/Suggestions.svelte';
  import Spinner from '$lib/Spinner.svelte';
  import { getCities } from '@api';
  import { history, favorites } from '@stores';
  import { buildParamString } from '@api/utils/misc';
  import { isSiret } from '@utils/siren';

  enum Mode {
    Search = 'search',
    Favs = 'bookmark',
    History = 'clock',
  }
  const { Search, Favs, History } = Mode;

  const dispatch = createEventDispatcher();

  const modeById = {
    [History]: {
      id: History,
      label: 'Historique',
    },
    [Favs]: {
      id: Favs,
      label: 'Favoris',
    },
    [Search]: {
      id: Search,
      label: 'Recherche',
    },
  };
  const modes = Object.values(modeById);

  export let autofocus = false;

  let showSuggestions = false;
  let suggestions: Suggestion[] = null;
  let value = '';
  let input: HTMLInputElement;
  let error = false;
  let mode = Search;

  function clearSearch(): void {
    value = '';
    suggestions = null;
  }

  function selectSuggestion({ detail }: CustomEvent<Suggestion>): void {
    const { data } = detail;
    if (data) {
      dispatch('select', data);
    }
  }

  async function handleInput({ target }: Event): Promise<void> {
    loading = false;
    error = false;

    const { value } = target as HTMLInputElement;

    const isText = Number.isNaN(Number(value));
    if (!isText) {
      showSuggestions = false;
      return;
    }

    suggestions = (await getCities(value)).map((city: City) => {
      const { code, nom, departement } = city;

      return {
        id: code,
        label: nom,
        href: `/budgets?insee=${code}`,
        sublabel: departement && `${departement.code} - ${departement.nom}`,
        data: { city },
      };
    });

    if (suggestions?.length) showSuggestions = true;
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

  function selectMode(id: Mode): void {
    if (mode === id) showSuggestions = !showSuggestions;
    mode = id;
    if (mode === Search) {
      input?.focus();
    }
  }
  function createUrl({ data, ...item }: LinkItem): string {
    if (!item.insee) item.siret = item.name; // no INSEE means a bare SIRET was searched

    const paramString = buildParamString(item);
    return '/budgets?' + paramString;
  }
  function createSuggestion(item: LinkItem): Suggestion {
    return {
      id: item.insee,
      label: item.name,
      href: createUrl(item),
      data: item.data,
    };
  }

  onMount(() => {
    if (autofocus) {
      input.focus();
    }
  });

  $: if (!$navigating) {
    if (mode === Search) clearSearch();
    showSuggestions = false;
  }

  $: if (!value) {
    suggestions = null;
  }

  $: loading = !showSuggestions && !!$navigating; // for SIRET search
  $: currentMode = modeById[mode];
  $: modes[0] = $history?.length ? modeById[History] : null;
  $: modes[1] = $favorites?.length ? modeById[Favs] : null;
  $: if (mode === Search) {
    suggestions = null;
    showSuggestions = false;
  }
  $: if (mode === History) {
    suggestions = $history.map(createSuggestion);
  }
  $: if (mode === Favs) {
    suggestions = $favorites.map(createSuggestion);
  }
  $: if (mode === History || mode === Favs) {
    showSuggestions = true;
  }
  $: if (mode === Favs && !$favorites.length) mode = Search;
  $: if (mode === History && !$history.length) mode = Search;

  $: clear =
    mode === Search
      ? clearSearch
      : mode === History
      ? history.clear
      : favorites.clear;
</script>

<div class="Search">
  <div class="searchbar" class:open={showSuggestions && suggestions?.length}>
    <menu
      on:click={() => {
        suggestions = null;
      }}
    >
      {#each modes.filter(x => x) as { id, label }}
        {@const current = mode === id}
        <button
          title={label}
          class:current
          on:click|stopPropagation={() => selectMode(id)}
        >
          <Icon {id} />
        </button>
      {/each}
    </menu>
    {#if mode === Search}
      <input
        bind:value
        bind:this={input}
        on:focus={() => {
          if (suggestions?.length > 0) {
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
    {#if mode !== Search || value}
      <div class="action">
        {#if loading}
          <button>
            <Spinner />
          </button>
        {:else}
          <button class="clear" on:click={clear}>
            <Icon id={mode === Search ? 'x' : 'trash-2'} />
          </button>
        {/if}
      </div>
    {/if}
  </div>
  {#if error}
    <div class="error">Introuvable</div>
  {:else if suggestions && showSuggestions}
    <Suggestions {suggestions} on:select={selectSuggestion} let:suggestion>
      {#if mode === Favs}
        <button
          on:click|preventDefault={() => {
            // here, stopPropagation does not prevent <a> from navigating
            favorites.removeItem(suggestion.label);
          }}
        >
          <Icon id="trash-2" />
        </button>
      {/if}
    </Suggestions>
  {/if}
</div>

<style lang="sass">
  .Search
    position: relative
    max-width: 40rem
    width: 100%
    font-size: 1.3rem
    border-radius: 0.8em
    color: $grey-lightest
    transition: 0.4s
    overflow: hidden

    input
      color: $grey-lightest

    &:focus-within
      .searchbar
        background: $grey-darkish

      color: $grey-lightest
      input
        color: $grey-lightest

    :global(button)
      transition: 0.4s
      display: flex
      justify-content: center
      align-items: center
      border-radius: 50%
      opacity: 0.3
      height: 1.8em
      width: 1.8em

      &.current
        opacity: 1

      &:hover, &:focus
        opacity: 1

        &:not(.current)
          background: rgba(black, 0.6)

  :global(.Search .Suggestion)
    button, :global(.Spinner)
      width: 1.5em
      height: 1.5em

    button
      opacity: 0.3
      &:hover, &:focus
        opacity: 1

  .searchbar
    display: flex
    background: $grey-dark
    border-color: white

    :global(.Icon)
      font-size: 1.3em
      cursor: pointer
    .clear
      :global(.Icon)
        font-size: 1.1em

    menu
      position: relative
      display: flex
      align-items: center
      justify-content: center
      gap: 0.2em
      margin-inline: 0.5em

    .action
      display: flex
      align-items: center
      margin-right: 0.5em

      button
        width: 1.5em
        height: 1.5em

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
