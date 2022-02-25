<script lang="ts">
  // import { formatValue } from '@utils';
  import LoadingText from '$lib/LoadingText.svelte';

  export let year: number;
  export let valueP: Promise<number> = undefined;
  export let maxP: Promise<number>;
  export let select: () => void = undefined;
  export let selected = false;

  let height: string;
  let pending = true;
  let unavailable = false;

  $: valueP.then(v => {
    pending = false;
    unavailable = !v;
  });

  $: Promise.all([valueP, maxP]).then(([v, max]) => {
    if (v) {
      setTimeout(() => (height = v / max + '%'), 50);
    }
  });
</script>

<li
  class="Year"
  class:pending
  class:unavailable
  class:selected
  on:click={!unavailable ? select : undefined}
>
  <LoadingText text={year.toString()} loading={pending} />
</li>

<style lang="scss">
  .Year {
    flex: 1 0;
    width: 5rem;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    align-items: stretch;
    margin: 0 0.5rem;
    font-size: 0.8rem;
    color: #333;
    opacity: 0.5;
    cursor: pointer;
    &:hover:not(.unavailable) {
      h3 {
        color: cornflowerblue;
      }
    }

    &.selected {
      opacity: 1;
      h3 {
        color: cornflowerblue;
      }
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  h3 {
    position: relative;
    font-size: 1rem;
    margin-top: 1rem;
    text-align: center;

    :global {
      .Spinner {
        position: absolute;
        margin-left: 0.3rem;
      }
    }
  }

  .unavailable {
    opacity: 0.1;
    cursor: default;
  }

  .pending {
    opacity: 0.2;
  }
</style>
