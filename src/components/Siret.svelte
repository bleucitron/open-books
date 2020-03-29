<script>
  export let siret;
  export let records;
  export let year;
  export let detail;

  const main = detail && detail.etablissementSiege;
</script>

<style>

</style>

<li class="Siret" class:main>
  <div>{`Siret n° ${siret}`}</div>
  <div>{year}</div>
  <div>{`${records.length} enregistrements`}</div>
</li>
