<script lang="ts">
  import type { City } from '@interfaces';
  import Spinner from '../../_components/Spinner.svelte';

  export let suggestions: City[] = [];
  export let select: (c: City) => void;
  export let city: City = undefined;
  export let current: number;
  let key;
  let bool: boolean;
  function enter(event): Event {
    key = event.key;
    return key;
  }
  function hover(): boolean {
    console.log(current);
    if (current === 0) {
      bool = true;
    } else {
      bool = false;
    }
  }
</script>

<ul>
  {#each suggestions as suggestion, index (index)}
    <li class="Suggestion" on:click={() => select(suggestion)}>
      <a
        on:keyup={enter}
        on:mouseenter={hover}
        href={`/budgets?name=${suggestion.nom}&insee=${suggestion.code}`}
        rel="prefetch"
        class:keyboard={current === index + 1 || bool}
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
  .keyboard-enter {
    background: coral !important;
    color: white;
    cursor: pointer;
  }
  .keyboard-black {
    background: #555;
    display: flex;
    padding: 0.5rem 1rem;
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
