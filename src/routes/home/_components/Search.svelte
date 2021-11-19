<script lang="ts">
  import { onMount } from 'svelte';

  import type { City } from '@interfaces';

  export let search: (s: string) => void;
  export let clear: () => void;
  export let selected: City = undefined;
  export let numberCity: number;
  let value = '';
  let key;
  let nb = 0;

  $: if (selected) {
    value = selected.nom;
  }

  onMount(async () => {
    search(value);
  });

  function reset(): void {
    value = '';
    clear();
  }

  function handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const text = target.value;
    search(text);
    value = text;
  }
  function test(event): number {
    //récupération de la clef
    key = event.key;
    console.log(key);
    switch (key) {
      case 'ArrowUp':
        nb = nb === 1 ? numberCity : nb - 1;

        break;
      case 'ArrowDown':
        nb = nb === numberCity ? 1 : nb + 1;
        break;
    }
  }
  function mouve(): number {
    return (nb = 0);
  }
</script>

<svelte:window on:keyup={test} on:mousemove={mouve} />
<div class="Search">
  <div class="searchbar">
    <i class="fas fa-search icon" />
    <input
      {value}
      on:input={handleInput}
      placeholder="Entrez le nom d'une commune"
    />
    {#if value}
      <span class="icon" on:click={reset}>
        <i class="fas fa-times" />
      </span>
    {/if}
  </div>
  <slot current={nb} />
</div>

<style lang="scss">
  * {
    color: white;
  }

  .Search {
    border-radius: 1rem;
    overflow: hidden;
    margin: 2rem auto;
    max-width: 75%;
    width: 50rem;
    height: fit-content;
  }

  .searchbar {
    display: flex;
    background: #444;
    color: white;
    align-items: center;
    border-color: white;

    &:focus-within {
      background: #333;
    }

    * {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .icon {
      margin: 0 1rem;
      font-size: 1.3rem;
    }

    span.icon {
      cursor: pointer;
    }
  }

  input {
    flex: 1 0;
    padding: 1rem;
    padding-left: 0;
    outline: none;
    font-size: 2rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;

    &::placeholder {
      color: #777;
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 1rem;
    }
  }
</style>
