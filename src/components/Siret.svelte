<script>
  export let id;
  export let records;
  // export let select;
  export let detail;

  const main = detail && detail.etablissementSiege;
</script>

<style>

</style>

<li class="Siret" class:main>
  <div>{`Siret n° ${id}`}</div>
  <div>{`${records.length} enregistrements`}</div>
</li>
