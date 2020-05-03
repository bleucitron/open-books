<script>
  import Spinner from './Spinner.svelte';

  export let siretsP;
  export let select;
  export let selected;

  const defaultLabel = 'commune';
</script>

<style lang="scss">
  .Sirets {
    display: flex;
    flex-flow: column;
    width: 15rem;
    margin: 0;
  }

  li {
    cursor: pointer;
    opacity: 0.2;
    text-transform: capitalize;

    &:hover {
      opacity: 0.8;
    }

    &.selected {
      opacity: 1;
    }
  }
</style>

<ul class="Sirets">
  {#await siretsP}
    <Spinner color={'#999'} />
  {:then sirets}
    {#each sirets as siret}
      <li
        on:click={() => select(siret.id)}
        class={selected === siret.id ? 'selected' : ''}>
        {siret.label || defaultLabel}
      </li>
    {/each}
  {/await}
</ul>
