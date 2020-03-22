<script>
  export let suggestions = [];
  export let select;

  function _safeSelect(...a) {
    select?.(...a);
  }

</script>

<style>
  ul {
    margin: 0;
  }

  li {
    display: flex;
    padding: 0.5rem 1rem;
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
    <li on:click={() => _safeSelect(suggestion)}>
      <div class="name">{suggestion.nom}</div>
      {#if suggestion.departement}
        <div class="other">
          {`${suggestion.departement.code} - ${suggestion.departement.nom}`}
        </div>
      {/if}
    </li>
  {/each}
</ul>
