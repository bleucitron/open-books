<script>
  import { onMount } from 'svelte';
  export let search;
  export let searching;
  export let selected;

  let value = 'Bordeaux';

  $: if (selected) {
    value = selected.nom;
  }
  $: department = selected && selected.departement;

  onMount(async () => {
    search(value);
  });

  function handleInput(e) {
    const text = e.target.value;
    search(text);
    value = text;
  }
</script>

<style lang="scss">
  * {
    background: grey;
    color: white;
  }

  .Search {
    border-radius: 1rem;
    overflow: hidden;
  }

  .searchbar {
    display: flex;
    border-color: white;
  }

  input {
    flex: 1 0;
    padding: 1rem;
    outline: none;
    font-size: 2rem;
    border: none;
    border-bottom: 1px solid transparent;
  }

  input:focus {
    border-bottom: 1px solid black;
    background: #444;
  }

  input::placeholder {
    color: #bbb;
  }
</style>

<div class="Search">
  <div class="searchbar">
    <input {value} on:input={handleInput} placeholder="Entrez une ville" />
    {#if department}
      <div>{department.nom}</div>
    {/if}
    {#if searching}
      <div>Recherche</div>
    {/if}
  </div>
  <slot />
</div>
