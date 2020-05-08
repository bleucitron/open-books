<script>
  import Spinner from './Spinner.svelte';

  export let labelsFromId;
  export let select;
  export let selected;

  $: labels = Object.values(labelsFromId);

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
  {#if labels.length === 0}
    <Spinner color={'#999'} />
  {:else}
    {#each labels as { id, label }}
      <li on:click={() => select(id)} class={selected === id ? 'selected' : ''}>
        {label || defaultLabel}
      </li>
    {/each}
  {/if}
</ul>
