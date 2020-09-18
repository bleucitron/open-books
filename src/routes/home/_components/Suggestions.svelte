<script lang="ts">
  import type { City } from '../../../interfaces';
  import Spinner from '../../_components/Spinner.svelte';

  export let suggestions: City[] = [];
  export let select: (c: City) => void;
  export let city: City | null;
</script>

<style lang="scss">
  ul {
    margin: 0;
  }

  a {
    background: #555;
    display: flex;
    padding: 0.5rem 1rem;
  }

  a:hover {
    background: coral;
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

<ul>
  {#each suggestions as suggestion}
    <li class="Suggestion" on:click={() => select(suggestion)}>
      <a
        href={`/budgets?name=${suggestion.nom}&insee=${suggestion.code}`}
        rel="prefetch">
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
