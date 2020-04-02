<script context="module">
  const start = 2012;
  // const end = 2019;
  const end = new Date().getFullYear();

  const years = [...Array(end - start).keys()].map(x => x + start);
</script>

<script>
  import Spinner from 'svelte-spinner';
  import Icon from 'svelte-awesome/components/Icon.svelte';
  import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
  import { getBudgets } from '../api';

  export let siret;
  export let save;

  const recordsPs = years.map(year => {
    return getBudgets({ ident: siret, year }).then(({ records }) => {
      save(year, records);
      return records;
    });
  });
</script>

<style>
  .years {
    display: flex;
    justify-content: space-between;
  }

  .year {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    margin: 0 0.5rem;
    padding: 0.5rem;
    height: 2.8rem;
    background: grey;
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

  .pending {
    opacity: 0.5;
  }

  .ready {
    background: #177317;
  }

  .error {
    opacity: 0.5;
  }
</style>

<li class="Siret">
  <div>{`Siret n° ${siret}`}</div>

  <ul class="years">
    {#each years as year, i}
      {#await recordsPs[i]}
        <li class="year pending">
          <h3>{year}</h3>
          <div class="icon">
            <Spinner color="white" />
          </div>
        </li>
      {:then records}
        <li class="year ready">
          <h3>{year}</h3>
          <div class="icon">
            <div>{`${records.length}`}</div>
          </div>
        </li>
      {:catch error}
        <li class="year error">
          <h3>{year}</h3>
          <div class="icon">
            <Icon data={faTimes} />
          </div>
        </li>
      {/await}
    {/each}
  </ul>
</li>
