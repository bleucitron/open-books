<script>
  import { onMount } from 'svelte';

  export let search;
  export let selected;

  let value = 'Bordeaux';
  let focus = false;

  $: if (selected) {
    value = selected.nom;
  }
  $: department =
    selected && (value === selected.nom ? selected.departement : undefined);

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
    margin: 2rem;
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

  i {
    width: 2rem;
    padding: 0 1rem;
  }

  .departement {
    padding: 0 1rem;

    .hyphen {
      margin: 0 0.5rem;
    }
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
    .departement {
      .name,
      .hyphen {
        display: none;
      }
    }
  }
</style>

<div class="Search">
  <div class="searchbar" class:focus class:selected>
    <i class="fas fa-search fa-2x" />
    <input
      {value}
      on:input={handleInput}
      on:focus={() => setFocus(true)}
      on:blur={() => setFocus(false)}
      placeholder="Entrez une ville" />
    {#if department}
      <div class="departement">
        <div class="code">{department.code}</div>
        <div class="hyphen">-</div>
        <div class="name">{department.nom}</div>
      </div>
    {/if}
  </div>
  <slot />
</div>
