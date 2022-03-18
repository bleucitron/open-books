<script lang="ts">
  import PieChartBudget from './PieChartBudget.svelte';
  import { BudgetType } from '@utils';

  export let credit_i: number;
  export let credit_f: number;
  export let debit_i: number;
  export let debit_f: number;
  export let select: (t: BudgetType) => void;
</script>

<div class="debit-credit">
  <PieChartBudget
    radius={100}
    data={[
      { label: 'credit 1', value: credit_i, color: 'coral' },
      { label: 'crédit 2', value: credit_f, color: '#333333' },
    ]}
    on:slice-click={() => select(BudgetType.CREDIT_I)}
  />
  <PieChartBudget
    radius={100}
    data={[
      { label: 'debit 1', value: debit_i, color: 'cornflowerblue' },
      { label: 'debit 2', value: debit_f, color: 'black' },
    ]}
    on:slice-click={() => select(BudgetType.DEBIT_I)}
  />
</div>

<style lang="scss">
  .debit-credit {
    flex: 1 0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 8.5rem;
    font-size: 3rem;
  }
</style>
