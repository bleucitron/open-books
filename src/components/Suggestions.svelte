<script>
  export let suggestions;
  export let select;
</script>

<style>
  ul {
    margin: 0;
  }

  li {
    display: flex;
    padding: 0.5rem;
  }

  li:hover {
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
      <div class="name">{suggestion.nom}</div>
      {#if suggestion.departement}
        <div class="other">
          {`${suggestion.departement.code} - ${suggestion.departement.nom}`}
        </div>
      {/if}
    </li>
  {/each}
</ul>
