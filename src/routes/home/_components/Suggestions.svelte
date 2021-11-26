<script lang="ts">
  import { goto } from '$app/navigation';

  import type { City } from '@interfaces';
  import Spinner from '../../_components/Spinner.svelte';

  export let suggestions: City[] = [];
  export let select: (c: City) => void;
  export let city: City = undefined;

  let current = 0;
  let key;
  let numberCity: number;
  function mousseInGestion(id): void {
    current = id + 1;
  }
  function mousseOutGestion(): void {
    current = 0;
  }
  function keyboardGestion(event): void {
    numberCity = suggestions.length;
    key = event.key;
    switch (key) {
      case 'ArrowUp': {
        if (current === 1 || current === 0) {
          current = numberCity;
        } else {
          current = current - 1;
        }
        break;
      }

      case 'ArrowDown': {
        current = current === numberCity ? 1 : current + 1;
        break;
      }

      case 'Enter': {
        const url = document.getElementById(current.toString()).href;
        select(suggestions[current - 1]);
        goto(url);
        break;
      }
    }
  }
</script>

<svelte:window on:keyup={keyboardGestion} />
<ul>
  {#each suggestions as suggestion, index (index)}
    <li class="Suggestion" on:click={() => select(suggestion)}>
      <a
        on:mouseenter={mousseInGestion(index)}
        on:mouseleave={mousseOutGestion()}
        href={`/budgets?name=${suggestion.nom}&insee=${suggestion.code}`}
        rel="prefetch"
        id={index + 1}
        class:keyboard={current === index + 1}
        class:keyboard-black={(current = !0)}
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

  .keyboard {
    background: coral !important;
    color: white;
    cursor: pointer;
  }
  .keyboard-black {
    background: #555;
    display: flex;
    padding: 0.5rem 1rem;
  }
  .keyboard-enter {
    background: coral !important;
    color: white;
    cursor: pointer;
  }

  .no-hover {
    pointer-events: none;
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
