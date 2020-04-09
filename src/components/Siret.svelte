<script>
  import Spinner from 'svelte-spinner';
  import { makeCSV } from '../utils';

  export let siret;
  export let years;
  export let recordsPs;

  const downloadPs = recordsPs.map(recordsP =>
    recordsP.then(async records => {
      const nomen = [...new Set(records.map(record => record.nomen))];
      const length = records.length;

      const csv = await makeCSV(records);

      return {
        nomen,
        length,
        csv,
      };
    }),
  );
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
    display: flex;
    justify-content: space-between;
    font-size: 2rem;
    line-height: 1.4rem;
  }

  .years {
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #333;
  }

  .year {
    flex: 1 0;
    display: flex;
    align-items: stretch;
  }

  .year a {
    flex: 1 0;
    height: 4rem;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    margin: 0 0.5rem;
    padding: 0.5rem;
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

  .info {
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
            <div class="info">
              <Spinner color="white" class="icon" />
            </div>
          </a>
        </li>
      {:then download}
        {#if download.length !== 0}
          <li class="year ready">
            <a href={download.csv} download={`${siret}_${year}.csv`}>
              <h3>{year}</h3>
              <div class="info">{download.nomen}</div>
              <div class="info">{download.length}</div>
            </a>
          </li>
        {:else}
          <li class="year unavailable">
            <a href>
              <h3>{year}</h3>
              <i class="fas fa-times info" />
            </a>
          </li>
        {/if}
      {:catch error}
        <li class="year error">
          <a href>
            <h3>{year}</h3>
            <i class="fas fa-times info" />
          </a>
        </li>
      {/await}
    {/each}
  </ul>
</li>
