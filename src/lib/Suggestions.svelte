<script context="module" lang="ts">
  export interface Suggestion {
    id: string;
    label: string;
    href: string;
    sublabel?: string;
    data?: unknown;
  }
</script>

<script lang="ts">
  import { navigating } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import Spinner from '$lib/Spinner.svelte';

  const anchorById: Record<string, HTMLAnchorElement> = {};

  export let suggestions: Suggestion[] = [];

  let current: number;
  let selected: number;

  const dispatch = createEventDispatcher();

  function keyboardGestion(e: KeyboardEvent): number {
    switch (e.key) {
      case 'ArrowUp': {
        if (current === 0 || current === undefined) {
          current = number;
        } else {
          current = current - 1;
        }
        break;
      }

      case 'ArrowDown': {
        if (current === number || current === undefined) {
          current = 0;
        } else {
          current = current + 1;
        }
        break;
      }

      case 'Enter': {
        selected = current;
        const suggestion = suggestions[selected];

        anchorById[suggestion.id].click();
        dispatch('select', suggestion);
        break;
      }
    }
    return current;
  }

  function handleClick(index: number): void {
    selected = index;
    dispatch('select', suggestions[index]);
  }

  $: number = suggestions.length - 1;
</script>

<svelte:window on:keyup={keyboardGestion} />

<ul class="Suggestions" transition:slide|local={{ duration: 200 }}>
  {#each suggestions as suggestion, index (index)}
    {@const { label, id, sublabel, href, data } = suggestion}
    {@const active = current === index}
    <li class="Suggestion" transition:slide|local={{ duration: 200 }}>
      <a
        on:click={() => handleClick(index)}
        on:keypress
        on:focus={() => (current = index)}
        on:mouseenter={() => (current = index)}
        {href}
        sveltekit:prefetch
        class:active
        bind:this={anchorById[id]}
      >
        <div class="infos">
          <div class="name">{label}</div>
          {#if data?.city}
            {@const dpt = data.city.departement}
            {@const sublabel = dpt && `${dpt.code} - ${dpt.nom}`}
            <div class="sublabel">
              {sublabel}
            </div>
          {/if}
        </div>

        {#if selected === index && $navigating}
          <Spinner />
        {:else}
          <slot {suggestion} />
        {/if}
      </a>
    </li>
  {/each}
</ul>

<style lang="sass">
  .Suggestions
    margin: 0
    width: 100%
    z-index: 260
    border-bottom-left-radius: 0.8em
    border-bottom-right-radius: 0.8em
    max-height: 29em
    overflow: auto
    font-size: 0.9em

    .Suggestion
      :global
        .Icon
          margin: 0

  a
    background: $grey-dark
    display: flex
    justify-content: space-between
    color: $grey-lightest
    padding: 0.5em

  .active,
  a:focus
    outline: none
    background: coral !important
    color: white
    cursor: pointer

  .infos
    display: flex
    padding-left: 0.5em

  .sublabel
    margin-left: 0.5em
    font-style: italic
    opacity: 0.4
</style>
