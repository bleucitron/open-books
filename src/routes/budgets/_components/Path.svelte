<script lang="ts">
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
        <i class="fas fa-caret-right next" />
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
  }

  .current {
    font-size: 2rem;
    line-height: 1.8rem;
  }
</style>
