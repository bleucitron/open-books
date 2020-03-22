<script>
  import { onMount } from 'svelte';
  import IoIosSearch from 'svelte-icons/io/IoIosSearch.svelte';
  export let search;
  export let searching;
  export let selected;

  let value = 'Bordeaux';
  let focus = false;

  $: if (selected) {
    value = selected.nom;
  }
  $: department = selected && selected.departement;

  onMount(async () => {
    search(value);
  });

  function setFocus(v) {
    focus = v;
  }

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

    * {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.selected {
      * {
        background: steelblue;
      }
    }

    &.focus {
      * {
        background: #444;
      }
    }
  }

  .icon {
    width: 2rem;
    padding: 0 0.5rem;
  }

  .departement {
    padding: 0 1rem;
  }

  input {
    flex: 1 0;
    padding: 1rem;
    padding-left: 0;
    outline: none;
    font-size: 2rem;
    border: none;
    border-bottom: 1px solid transparent;

    &::placeholder {
      color: #bbb;
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 1rem;
    }
  }
</style>

<div class="Search">
  <div class="searchbar" class:focus class:selected>
    <div class="icon">
      <IoIosSearch />
    </div>
    <input
      {value}
      on:input={handleInput}
      on:focus={() => setFocus(true)}
      on:blur={() => setFocus(false)}
      placeholder="Entrez une ville" />
    {#if department}
      <div class="departement">{`${department.code} - ${department.nom}`}</div>
    {/if}
  </div>
  <slot />
</div>
