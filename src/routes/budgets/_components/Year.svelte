<script lang="ts">
  import { formatValue } from '@utils';
  import Spinner from '../../_components/Spinner.svelte';

  export let year: number;
  export let pending = false;
  export let value: number = undefined;
  export let maxP: Promise<number>;
  export let select: () => void = undefined;
  export let selected = false;

  let height: string;

  const unavailable = !pending && !value;
  const ready = !!value;

  if (maxP)
    maxP.then(max => {
      if (!unavailable) {
        setTimeout(() => (height = (value! / max) * 100 + '%'), 50);
      }
    });

  function _select(): void {
    if (ready) select?.();
  }
</script>

<li
  class="Year"
  class:pending
  class:unavailable
  class:ready
  class:selected
  on:click={_select}
>
  <div class="info">
    {#if pending}
      <Spinner size={1.5} />
    {:else if unavailable}
      <i class="fas fa-times icon" />
    {:else if value}
      <div class="value" style={`height: ${height};`}>
        {formatValue(value)}
      </div>
    {/if}
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

  .Year.ready {
    cursor: pointer;
  }

  .Year.ready:hover {
    .value {
      background: coral;
    }
  }

  .Year.selected {
    .value {
      background: cornflowerblue;
    }
  }

  // .Year.selected:hover {
  // }

  .Year:first-child {
    margin-left: 0;
  }

  .Year:last-child {
    margin-right: 0;
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

  .icon {
    color: transparent;
  }

  .spinner {
    display: flex;
    align-items: center;
    flex: 1 0;
  }
</style>
