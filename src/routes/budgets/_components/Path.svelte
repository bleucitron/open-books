<script lang="ts">
  export let steps: { label: string; select: () => void }[];
  export let reset: () => void;
</script>

<div class="path">
  <i on:click={reset} class="fas fa-times-circle reset" />
  {#each steps as { label, select }}
    <div class="step" on:click={select}>
      {label}
      <i class="fas fa-caret-right next" />
    </div>
  {/each}
</div>

<style lang="scss">
  .path {
    display: flex;
    align-items: baseline;
  }

  .next {
    margin: 0 0.5rem;
  }

  .reset,
  .step {
    &:hover {
      color: coral;
      cursor: pointer;
    }
  }

  .step {
    &:first-of-type {
      margin-left: 0.5rem;
    }

    &:last-of-type {
      font-size: 1.5rem;

      &:hover {
        color: unset;
        cursor: unset;
      }

      i {
        display: none;
      }
    }
  }
</style>
