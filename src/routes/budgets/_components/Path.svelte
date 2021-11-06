<script lang="ts">
  import Icon from '../../_components/Icon.svelte';

  export let steps: { label: string; select: () => void }[];

  $: current = steps.pop()?.label;
</script>

<div class="path">
  {#if current}
    <div class="current">{current}</div>
  {/if}
  <div class="steps">
    {#each steps as { label, select }}
      <div class="step" on:click={select}>
        {label}
        <Icon id="chevron-right" />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .path {
    flex: 1 0;
    display: flex;
    flex-flow: column-reverse;
  }

  .steps {
    display: flex;
    font-size: 0.9rem;
  }

  .next {
    margin: 0 0.5rem;
  }

  .step {
    &:hover {
      color: coral;
      cursor: pointer;
    }

    :global(.Icon) {
      font-size: 1.2em;
      vertical-align: text-bottom;
    }
  }

  .current {
    font-size: 2rem;
    line-height: 1.8rem;
  }
</style>
