<script>
  import Spinner from 'svelte-spinner';
  import Year from './Year.svelte';
  import { makeCSV } from '../utils';

  export let id;
  export let budgetPs;
  export let city;
  export let years;

  let allLabels = [];

  budgetPs.forEach((budgetP, i) =>
    budgetP.then(({ length, label }) => {
      if (length > 0) allLabels = [...new Set([...allLabels, label])];
    }),
  );

  const maxP = Promise.all(budgetPs).then(results => {
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
      {#await budgetPs[i]}
        <Year {year} {maxP} />
      {:then budget}
        <Year
          {year}
          value={budget.credit}
          length={budget.length}
          url={budget.url}
          file={budget.file}
          {maxP} />
      {/await}
    {/each}
  </ul>
</li>
