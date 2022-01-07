<script lang="ts">
  // import { goto } from '$app/navigation';
  import type { City } from '@interfaces';
  import Spinner from '$lib/Spinner.svelte';

  export let suggestions: City[] = [];
  export let select: (c: City) => void;
  export let city: City = undefined;
  export let visit: (s: string) => void = undefined;

  let current: number = undefined;

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
        select(suggest);
        visit(`/budgets?name=${suggest.nom}&insee=${suggest.code}`);
        break;
      }
    }
    return current;
  }

  $: number = suggestions.length - 1;
</script>

<svelte:window on:keyup={keyboardGestion} />
<ul>
  {#each suggestions as suggestion, index (index)}
    <li class="Suggestion" on:click={() => select(suggestion)}>
      <a
        on:mouseenter={() => (current = index)}
        on:mouseleave={() => (current = 0)}
        href={`/budgets?name=${suggestion.nom}&insee=${suggestion.code}`}
        sveltekit:prefetch
        class:active={current === index}
      >
        <div class="infos">
          <div class="name">{suggestion.nom}</div>
          {#if suggestion.departement}
            <div class="other">
              {`${suggestion.departement.code} - ${suggestion.departement.nom}`}
            </div>
          {/if}
        </div>

        {#if city && city.code === suggestion.code}
          <Spinner />
        {/if}
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    margin: 0;
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
