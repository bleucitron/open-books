<script>
  import Spinner from 'svelte-spinner';
  import Year from './Year.svelte';
  import { makeCSV } from '../utils';

  export let id;
  export let recordsPs;
  export let city;
  export let years;

  let allLabels = [];

  const infoPs = recordsPs.map((recordsP, i) => {
    return recordsP.then(async records => {
      const nomen = [...new Set(records.map(record => record.nomen))];
      const length = records.length;

      const labels = records.map(record => record.lbudg.toLowerCase());
      allLabels = [...new Set([...allLabels, ...labels])];

      const csv = await makeCSV(records);

      const blob = new Blob([csv], { type: 'text/csv' });
      const name = `${id}_${years[i]}.csv`;
      const url = URL.createObjectURL(blob);

      const debit = records.reduce((sum, { sd }) => sum + sd, 0);
      const credit = records.reduce((sum, { sc }) => sum + sc, 0);

      return {
        nomen,
        length,
        url,
        name,
        debit,
        credit,
      };
    });
  });

  const maxP = Promise.all(infoPs).then(results => {
    return Math.max(...results.map(v => v.credit));
  });

  function makeLabel(labels) {
    if (labels.length === 0) return '';
    if (labels.length > 1) {
      console.error('More than 1 label for', id);
    }

    const label = labels[0];

    const isSame = label.toLowerCase() === city.name.toLowerCase();
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

  header a {
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
    align-items: stretch;
    padding-top: 3rem;
    padding-bottom: 1rem;
    background: #333;
    height: 20rem;
  }
</style>

<li class="Siret">
  <header>
    <a href={`/${city.code}/${id}?name=${city.name}`}>
      <div class="label">{makeLabel(allLabels)}</div>
      <div class="id">{`Siret n° ${id}`}</div>
    </a>
  </header>

  <ul class="years">
    {#each years as year, i}
      {#await infoPs[i]}
        <Year {year} {maxP} />
      {:then info}
        <Year {year} {info} {maxP} />
      {/await}
    {/each}
  </ul>
</li>
