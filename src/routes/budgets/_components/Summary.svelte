<script lang="ts">
  import classnames from 'classnames';
  import { formatValue, makeCSV } from '../../../utils';
  import Spinner from '../../_components/Spinner.svelte';
  import Csv from '../_components/Csv.svelte';

  import type { Budget } from '../../../interfaces';

  export let budgetP: Promise<Budget | null>;
  export let year: number;
</script>

<style lang="scss">
  .Summary {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    background: white;
  }

  .values {
    flex: 1 0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .value {
    text-align: center;
    width: 40%;
    margin: 0 1rem;
    font-size: 4rem;
  }

  h3 {
    margin: 0.5rem;
    font-size: 2.5rem;
    text-align: center;
    position: relative;
  }

  h4 {
    font-size: 1.5rem;
  }

  .none {
    font-size: 1.5rem;
    text-align: center;
  }
</style>

<div class="Summary">
  <h3>
    {year}
    {#await budgetP then budget}
      {#if budget}
        <Csv data={budget} />
      {/if}
    {/await}
  </h3>
  {#await budgetP}
    <Spinner color={'#333'} size={'3'} />
  {:then budget}
    {#if !budget}
      <div class="values none">Aucun budget</div>
    {:else}
      <div class="values">
        <div class="value credit">
          <h4>Recettes</h4>
          {formatValue(budget.credit)}
        </div>
        <div class="value debit">
          <h4>Dépenses</h4>
          {formatValue(budget.debit)}
        </div>
      </div>
    {/if}
  {/await}
</div>
