<script>
  import Spinner from 'svelte-spinner';
  export let mainSiretP;
  export let otherSiretsP;
</script>

<style>

</style>

<ul class="Sirets">
  <li>
    {#await mainSiretP}
      <Spinner />
    {:then mainSiret}
      {mainSiret.label}
    {/await}
  </li>
  {#await otherSiretsP}
    <Spinner />
  {:then sirets}
    {#each sirets as siret}
      <li>{siret.label}</li>
    {/each}
  {/await}
</ul>
