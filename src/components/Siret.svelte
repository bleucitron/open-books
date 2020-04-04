<script>
  import Spinner from 'svelte-spinner';

  export let siret;
  export let years;
  export let recordsPs;
</script>

<style>
  .Siret {
    margin: 2rem 0;
  }

  .id,
  .years {
    padding: 0 2rem;
  }

  .id {
    font-size: 2rem;
    line-height: 1.4rem;
  }

  .years {
    display: flex;
    justify-content: space-between;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    background: #333;
  }

  .year {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    margin: 0 0.5rem;
    padding: 0.5rem;
    height: 2.8rem;
    background: #666;
    color: white;
    border-radius: 8px;
  }

  .year:first-child {
    margin-left: 0;
  }

  .year:last-child {
    margin-right: 0;
  }

  h3 {
    text-align: center;
  }

  .icon {
    display: flex;
    align-items: center;
    flex: 1 0;
    justify-content: space-around;
    opacity: 0.3;
  }

  .unavailable,
  .error {
    opacity: 0.2;
  }

  .pending {
    opacity: 0.6;
  }
</style>

<li class="Siret">
  <div class="id">{`Siret n° ${siret}`}</div>

  <ul class="years">
    {#each years as year, i}
      {#await recordsPs[i]}
        <li class="year pending">
          <h3>{year}</h3>
          <div class="icon">
            <Spinner color="white" class="icon" />
          </div>
        </li>
      {:then records}
        <li class={records.length === 0 ? 'year unavailable' : 'year ready'}>
          <h3>{year}</h3>
          <div class="icon">{`${records.length}`}</div>
        </li>
      {:catch error}
        <li class="year error">
          <h3>{year}</h3>
          <i class="fas fa-times icon" />
        </li>
      {/await}
    {/each}
  </ul>
</li>
