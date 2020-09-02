<script lang="ts">
  import type { City } from '../../../interfaces';

  export let suggestions: City[] = [];
  export let select: (c: City) => void;
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

  .other {
    margin-left: 0.5rem;
    font-style: italic;
    opacity: 0.3;
  }
</style>

<ul>
  {#each suggestions as suggestion}
    <li on:click={() => select(suggestion)}>
      <a
        href={`/budgets?name=${suggestion.nom}&insee=${suggestion.code}`}
        rel="prefetch">
        <div class="name">{suggestion.nom}</div>
        {#if suggestion.departement}
          <div class="other">
            {`${suggestion.departement.code} - ${suggestion.departement.nom}`}
          </div>
        {/if}
      </a>
    </li>
  {/each}
</ul>
