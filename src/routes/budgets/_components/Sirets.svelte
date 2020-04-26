<script>
  import Spinner from 'svelte-spinner';
  export let mainSiretP;
  export let otherSiretsP;
  export let select;
  export let selected;
  export let format;
</script>

<style lang="scss">
  .Sirets {
    padding: 0 1rem;
    width: 15rem;
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
  {#await mainSiretP}
    <div class="spinner">
      <Spinner />
    </div>
  {:then mainSiret}
    <li
      on:click={() => select(mainSiret.id)}
      class={selected === mainSiret.id ? 'selected' : ''}>
      {format(mainSiret.label)}
    </li>
  {/await}
  {#await otherSiretsP}
    <div class="spinner">
      <Spinner />
    </div>
  {:then sirets}
    {#each sirets as siret}
      <li
        on:click={() => select(siret.id)}
        class={selected === siret.id ? 'selected' : ''}>
        {format(siret.label)}
      </li>
    {/each}
  {/await}
</ul>
