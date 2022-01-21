<script lang="ts">
  import Search from './_components/Search.svelte';

  import { goto } from '$app/navigation';

  function handleSearch(event): void {
    const { nom, code } = event.detail.city;
    goto(`/budgets?name=${nom}&insee=${code}`);
  }
</script>

<svelte:head>
  <title>Livres ouverts</title>
</svelte:head>

<main>
  <Search on:select={handleSearch} />
</main>

<style lang="scss">
  main {
    flex: 1 0;
    display: flex;
    padding-top: 10%;
  }
</style>
