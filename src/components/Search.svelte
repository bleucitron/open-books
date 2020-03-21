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

<style>
  .searchbar {
    display: flex;
  }

  input {
    flex: 1 0;
    outline: none;
    font-size: 2rem;
    border: none;
    border-bottom: 1px solid transparent;
  }

  input:focus {
    border-bottom: 1px solid black;
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
