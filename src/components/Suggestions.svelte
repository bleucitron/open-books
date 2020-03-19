<script>
  // export let find;
  export let suggestions;
</script>

<style>
  ul {
    margin: 0;
  }
</style>

<ul>
  {#each suggestions as {nom}}
  <li>
    <div>{nom}</div>
  </li>
  {/each}
</ul>
