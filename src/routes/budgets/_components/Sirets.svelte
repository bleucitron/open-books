<script>
  import Spinner from 'svelte-spinner';
  export let siretsP;
  export let select;
  export let selected;
</script>

<style lang="scss">
  .Sirets {
    width: 15rem;
    padding: 0 1rem;
  }

  li {
    cursor: pointer;
    opacity: 50%;
    text-transform: capitalize;

    &:hover {
      opacity: 70%;
    }

    &.selected {
      opacity: 100%;
    }
  }
</style>

<ul class="Sirets">
  {#await siretsP}
    <div class="spinner">
      <Spinner />
    </div>
  {:then sirets}
    {#each sirets as siret}
      <li
        on:click={() => select(siret.id)}
        class={selected === siret.id ? 'selected' : ''}>
        {siret.label}
      </li>
    {/each}
  {/await}
</ul>
