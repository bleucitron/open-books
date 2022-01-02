<script lang="ts">
  import { formatValue } from '@utils';

  import Icon from '$lib/Icon.svelte';
  import Spinner from '$lib/Spinner.svelte';

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
      setTimeout(() => (height = (v / max) * 100 + '%'), 50);
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
  <div class="info">
    {#await valueP}
      <Spinner size={1.5} />
    {:then value}
      {#if value}
        <div class="value" style={`height: ${height};`}>
          {formatValue(value)}
        </div>
      {:else}
        <Icon id="x" />
      {/if}
    {/await}
  </div>
  <h3>{year}</h3>
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
    color: white;
    cursor: pointer;

    :global(.Icon) {
      font-size: 2em;
    }

    &:hover {
      .value {
        background: coral;
      }
    }

    &.selected {
      .value {
        background: cornflowerblue;
      }
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .value {
    display: flex;
    padding: 3px;
    height: 1.5rem;
    flex-flow: column;
    align-items: center;
    background: #666;
    border-radius: 8px;
    transition: height 0.5s ease-in-out;
  }

  h3 {
    font-size: 1rem;
    margin-top: 1rem;
    text-align: center;
  }

  .info {
    display: flex;
    flex-flow: column;
    align-items: stretch;
    flex: 1 0;
    justify-content: flex-end;
  }

  .unavailable {
    opacity: 0.1;
    cursor: default;
  }

  .pending {
    opacity: 0.2;
  }

  .pending div {
    padding: 0;
  }

  .pending .info,
  .unavailable .info {
    align-items: center;
    justify-content: center;
  }
</style>
