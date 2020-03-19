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
    background: #ddd;
    cursor: pointer;
  }

  .other {
    margin-left: 0.5rem;
    color: #aaa;
    font-style: italic;
  }
</style>

<ul>
  {#each suggestions as {nom, departement, region}}
  <li>
    <div class="name">{`${nom} (${departement.code})`}</div>
    <div class="other">{`${departement.nom} - ${region.nom}`}</div>
  </li>
  {/each}
</ul>
