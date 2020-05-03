<script>
  import classnames from 'classnames';
  import Spinner from './Spinner.svelte';
  import { formatValue, makeCSV } from '../../../utils';

  export let budget;
</script>

<style>
  .Summary {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: stretch;
    width: 100%;
  }

  .values {
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

  h4 {
    font-size: 1.5rem;
  }

  .none {
    font-size: 1.5rem;
    text-align: center;
  }
</style>

<div class="Summary">
  {#if budget === undefined}
    <Spinner color={'#333'} size={'3rem'} />
  {:else if budget === null}
    <div class="none">Aucun budget</div>
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
</div>
