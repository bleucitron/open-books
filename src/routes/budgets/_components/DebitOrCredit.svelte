<script lang="ts">
  import Donut from './Donut.svelte';
  import { BudgetType } from '@utils';

  export let credit_i: number;
  export let credit_f: number;
  export let debit_i: number;
  export let debit_f: number;
  export let select: (t: BudgetType) => void;

  $: credit = credit_f + credit_i;
  $: debit = debit_f + debit_i;

  $: max = Math.max(credit, debit);
</script>

<div class="debit-credit">
  <div class="container">
    <Donut
      scale={credit / max}
      data={[
        {
          label: BudgetType.CREDIT_I,
          value: credit_i,
          color: 'red',
        },
        { label: BudgetType.CREDIT_F, value: credit_f, color: 'coral' },
      ]}
      on:click={data => select(data.detail.label)}
    />
    <div>Recettes</div>
  </div>
  <div class="container">
    <Donut
      scale={debit / max}
      data={[
        { label: BudgetType.DEBIT_I, value: debit_i, color: 'blue' },
        { label: BudgetType.DEBIT_F, value: debit_f, color: 'cornflowerblue' },
      ]}
      on:click={data => select(data.detail.label)}
    />
    <div>Dépenses</div>
  </div>
</div>

<style lang="scss">
  .debit-credit {
    flex: 1 0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 8.5rem;
    font-size: 1.5rem;
    text-align: center;
  }
</style>
