<script>
  import classnames from 'classnames';
  import Spinner from './Spinner.svelte';
  import { formatValue } from '../../../utils';

  export let year;
  export let pending = false;
  export let value = undefined;
  export let maxP;
  export let select = undefined;
  export let selected = false;

  let height;
  let transitioned;

  const unavailable = !pending && !value;
  const ready = !pending && !unavailable;

  if (maxP)
    maxP.then(max => {
      if (!pending) {
        setTimeout(() => (height = (value / max) * 100 + '%'), 50);
      }
    });

  $: classes = classnames('Year', { pending, unavailable, ready, selected });

  function _select() {
    if (ready && select) select();
  }
</script>

<style>
  .Year {
    flex: 1 0;
    width: 5rem;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    align-items: stretch;
    margin: 0 0.5rem;
    opacity: 0.6;
    font-size: 0.8rem;
    color: white;
  }

  .value {
    display: flex;
    box-sizing: border-box;
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
    opacity: 0.8;
  }

  .Year.selected {
    opacity: 1;
  }

  .Year.selected:hover {
    opacity: 1;
  }

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

  i {
    color: transparent;
  }

  .spinner {
    display: flex;
    align-items: center;
    flex: 1 0;
  }
</style>

<li class={classes} on:click={_select}>
  <div class="info">
    {#if pending}
      <Spinner />
    {:else if unavailable}
      <i class="fas fa-times" />
    {:else if ready}
      <div class="value" style={`height: ${height};`}>{formatValue(value)}</div>
    {/if}
  </div>
  <h3>{year}</h3>
</li>