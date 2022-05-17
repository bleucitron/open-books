<script lang="ts">
  import { navigating } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { City } from '@interfaces';
  import Spinner from '$lib/Spinner.svelte';

  export let suggestions: City[] = [];

  let current: number = undefined;

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
        const suggestion = suggestions[current];
        dispatch('select', suggestion);
        break;
      }
    }
    return current;
  }

  function handleClick(index: number): void {
    current = index;
    dispatch('select', suggestions[index]);
  }

  $: number = suggestions.length - 1;
</script>

<svelte:window on:keyup={keyboardGestion} />

<ul class="Suggestions" in:slide={{ duration: 200 }}>
  {#each suggestions as suggestion, index (index)}
    {@const { nom, code, departement } = suggestion}
    {@const active = current === index}
    <li class="Suggestion">
      <a
        on:click={() => handleClick(index)}
        on:keypress
        on:focus={() => (current = index)}
        on:mouseenter={() => (current = index)}
        href={`/budgets?name=${nom}&insee=${code}`}
        sveltekit:prefetch
        class:active
      >
        <div class="infos">
          <div class="name">{nom}</div>
          {#if departement}
            <div class="other">
              {`${departement.code} - ${departement.nom}`}
            </div>
          {/if}
        </div>

        {#if active && $navigating}
          <Spinner />
        {/if}
      </a>
    </li>
  {/each}
</ul>

<style lang="sass">
  .Suggestions
    margin: 0
    position: absolute
    top: 100%
    left: 0
    width: 100%
    z-index: 260
    border-bottom-left-radius: 12px
    border-bottom-right-radius: 12px
    overflow: hidden
    font-size: 0.9em

  a
    background: $grey-dark
    display: flex
    justify-content: space-between
    color: white
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

  .other
    margin-left: 0.5em
    font-style: italic
    opacity: 0.3

  .Suggestion
    :global
      .Icon
        margin: 0
</style>
