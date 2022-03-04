<script lang="ts">
  // import { goto } from '$app/navigation';
  import type { City } from '@interfaces';
  import { createEventDispatcher } from 'svelte';

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
        const suggest = suggestions[current];
        dispatch('select', { city: suggest });
        break;
      }
    }
    return current;
  }

  function handleClick(suggestions: City): void {
    dispatch('select', { city: suggestions });
  }

  $: number = suggestions.length - 1;
</script>

<svelte:window on:keyup={keyboardGestion} />
<ul>
  {#each suggestions as suggestion, index (index)}
    {@const { nom, code, departement } = suggestion}
    <li class="Suggestion">
      <a
        on:click={() => handleClick(suggestion)}
        on:keypress
        on:mouseenter={() => (current = index)}
        on:mouseleave={() => (current = 0)}
        href={`/budgets?name=${nom}&insee=${code}`}
        sveltekit:prefetch
        class:active={current === index}
      >
        <div class="infos">
          <div class="name">{nom}</div>
          {#if departement}
            <div class="other">
              {`${departement.code} - ${departement.nom}`}
            </div>
          {/if}
        </div>

        <!-- {#if city && city.code === code}
          <Spinner />
        {/if} -->
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    margin: 0;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 260;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    overflow: hidden;
  }

  a {
    background: #555;
    display: flex;
    padding: 0.5rem 1rem;
  }

  .active {
    background: coral !important;
    color: white;
    cursor: pointer;
  }
  .infos {
    display: flex;
  }

  .other {
    margin-left: 0.5rem;
    font-style: italic;
    opacity: 0.3;
  }

  .Suggestion :global(.Spinner) {
    justify-content: flex-end;
  }
</style>
