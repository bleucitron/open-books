<script>
  import Spinner from 'svelte-spinner';
  import classnames from 'classnames';

  export let year;
  export let info = null;
  export let maxP = null;

  let height;

  const pending = !info;
  const unavailable = !pending && info.length === 0;
  const ready = !pending && !unavailable;

  if (maxP)
    maxP.then(max => {
      if (!pending) {
        setTimeout(() => (height = (info.credit / max) * 100 + '%'), 50);
      }
    });

  const classes = classnames('Year', { pending, unavailable, ready });

  // height = ready ? 100 : height;
  const href = ready ? info.url : null;
  const download = ready ? info.name : null;
</script>

<style>
  .Year {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    align-items: stretch;
    margin: 0 0.5rem;
    opacity: 0.6;
    color: white;
  }

  .Year a {
    display: flex;
    padding: 0.5rem;
    height: 1.5rem;
    flex-flow: column;
    align-items: center;
    background: #666;
    border-radius: 8px;
    transition: height 0.5s ease-in-out;
  }

  .Year.ready:hover {
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
    opacity: 0.2;
  }

  .pending {
    opacity: 0.4;
  }

  .pending a {
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

<li class={classes}>
  <div class="info">
    {#if pending}
      <div class="spinner">
        <Spinner color="white" />
      </div>
    {:else if unavailable}
      <i class="fas fa-times" />
    {:else if ready}
      <a {href} {download} style={`height: ${height};`}>{info.length}</a>
    {/if}
  </div>
  <h3>{year}</h3>
</li>
