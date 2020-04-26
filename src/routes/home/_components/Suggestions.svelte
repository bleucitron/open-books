<script>
  export let suggestions = [];
  export let select;
</script>

<style>
  ul {
    margin: 0;
  }

  a {
    display: flex;
    padding: 0.5rem 1rem;
  }

  a:hover {
    background: #444;
    color: white;
    cursor: pointer;
  }

  .other {
    margin-left: 0.5rem;
    color: #aaa;
    font-style: italic;
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
