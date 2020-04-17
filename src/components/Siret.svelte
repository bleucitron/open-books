<script>
  import Spinner from 'svelte-spinner';
  import { makeCSV } from '../utils';

  export let id;
  export let recordsPs;
  export let name;
  export let years;

  let allLabels = [];

  const downloadPs = recordsPs.map(recordsP =>
    recordsP.then(async records => {
      const nomen = [...new Set(records.map(record => record.nomen))];
      const length = records.length;

      const labels = records.map(record => record.lbudg.toLowerCase());
      allLabels = [...new Set([...allLabels, ...labels])];

      const csv = await makeCSV(records);

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      return {
        nomen,
        labels,
        length,
        url,
      };
    }),
  );

  function makeLabel(labels) {
    if (labels.length === 0) return '';
    if (labels.length > 1) {
      console.error('More than 1 label for', id);
    }

    const label = labels[0];

    const isSame = label.toLowerCase() === name.toLowerCase();
    if (isSame) return 'Commune';

    return label;
  }
</script>

<style>
  .Siret {
    margin-top: 2rem;
  }

  header,
  .years {
    padding: 0 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    font-size: 2rem;
    line-height: 1.4rem;
  }

  .id {
    font-size: 1.2rem;
  }

  .label {
    text-transform: capitalize;
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
    margin: 0 0.5rem;
  }

  .year a {
    flex: 1 0;
    height: 4rem;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    padding: 0.5rem;
    background: #666;
    color: white;
    border-radius: 8px;
  }

  .year.ready:hover a {
    background: #777;
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
  <header>
    <div class="label">{makeLabel(allLabels)}</div>
    <div class="id">{`Siret n° ${id}`}</div>
  </header>

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
            <a href={download.url} download={`${id}_${year}.csv`}>
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
