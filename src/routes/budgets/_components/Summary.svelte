<script>
  import Spinner from 'svelte-spinner';
  import classnames from 'classnames';
  import { formatValue } from '../../../utils';

  export let budget;
  export let year;
</script>

<style>
  .Budget {
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;
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

  h3 {
    font-size: 2.5rem;
    margin-top: 1rem;
    margin-bottom: 5rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  .none {
    font-size: 1.5rem;
  }
</style>

<div class="Budget">
  <h3>{year}</h3>
  {#if budget === undefined}
    <div class="spinner">
      <Spinner />
    </div>
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
