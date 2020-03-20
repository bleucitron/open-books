<script>
  export let suggestions;
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
  {#each suggestions as { nom, departement }}
    <li>
      <div class="name">{nom}</div>
      {#if departement}
        <div class="other">{`${departement.code} - ${departement.nom}`}</div>
      {/if}
    </li>
  {/each}
</ul>
