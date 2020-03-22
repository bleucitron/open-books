<script>
  import Siret from '../components/Siret.svelte';
  export let sirets;
</script>

<style>

</style>

<ul class="Sirets">
  {#if sirets.length !== 0}
    {#each sirets as siret}
      <Siret {...siret} />
    {/each}
  {:else}
    <div>Aucun enregistrement</div>
  {/if}
</ul>
