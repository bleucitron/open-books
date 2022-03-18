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
      { label: BudgetType.CREDIT_I, value: credit_i, color: 'coral' },
      { label: BudgetType.CREDIT_F, value: credit_f, color: '#333333' },
    ]}
    on:slice-click={data => select(data.detail.label)}
  />
  <PieChartBudget
    radius={100}
    data={[
      { label: BudgetType.DEBIT_I, value: debit_i, color: 'cornflowerblue' },
      { label: BudgetType.DEBIT_F, value: debit_f, color: 'black' },
    ]}
    on:slice-click={data => select(data.detail.label)}
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
