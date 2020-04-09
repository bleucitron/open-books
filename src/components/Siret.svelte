<script>
  import Spinner from 'svelte-spinner';
  import { makeCSV } from '../utils';

  export let siret;
  export let years;
  export let recordsPs;

  const downloadPs = recordsPs.map(recordsP => recordsP.then(makeCSV));
</script>

<style>
  .Siret {
    margin-top: 2rem;
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
  }

  .year a {
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

  /* .year.ready:hover a {
    background: #777;
  } */

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
      {#await downloadPs[i]}
        <li class="year pending">
          <a href>
            <h3>{year}</h3>
            <div class="icon">
              <Spinner color="white" class="icon" />
            </div>
          </a>
        </li>
      {:then download}
        <li class={download.length === 0 ? 'year unavailable' : 'year ready'}>
          <a href={download.csv} download={`${siret}_${year}.csv`}>
            <h3>{year}</h3>
            <div class="icon">{download.length}</div>
          </a>
        </li>
      {:catch error}
        <li class="year error">
          <a href>
            <h3>{year}</h3>
            <i class="fas fa-times icon" />
          </a>
        </li>
      {/await}
    {/each}
  </ul>
</li>
