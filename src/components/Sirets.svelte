<script>
  import Siret from '../components/Siret.svelte';
  export let sirets;
</script>

<style>

</style>

<ul class="Sirets">
  {#each sirets as siret}
    <Siret {...siret} />
  {/each}
</ul>
