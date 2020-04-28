<script>
  import Spinner from 'svelte-spinner';
  import classnames from 'classnames';
  import { formatValue } from '../../../utils';

  export let budget;
</script>

<style>

</style>

<div class="Budget">
  <div class="values">
    <div class="credit">{formatValue(budget.credit)}</div>
    <div class="dedit">{formatValue(budget.debit)}</div>
  </div>
</div>
