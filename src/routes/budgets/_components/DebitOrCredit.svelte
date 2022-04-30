<script lang="ts">
  import { formatCurrency, BudgetType, FILabel } from '@utils';
  import { sand, water } from '@utils/colors';
  import Donut from './Donut.svelte';

  const { CREDIT_I, CREDIT_F, DEBIT_I, DEBIT_F } = BudgetType;

  export let credit_i: number;
  export let credit_f: number;
  export let debit_i: number;
  export let debit_f: number;
  export let select: (t: BudgetType) => void;

  $: credit = credit_f + credit_i;
  $: debit = debit_f + debit_i;

  $: max = Math.max(credit, debit);
</script>

<div class="Debit-Credit">
  <figure class="container">
    <Donut
      scale={credit / max}
      data={[
        {
          id: BudgetType.CREDIT_I,
          label: FILabel.I,
          value: credit_i,
          color: sand,
        },
        {
          id: BudgetType.CREDIT_F,
          label: FILabel.F,
          value: credit_f,
          color: water,
        },
      ]}
      on:click={data => select(data.detail.id)}
    />
    <figcaption>
      <div>Recettes</div>
      <ul class="visually-hidden">
        <li class="i" style:color="#4297A0" on:click={() => select(CREDIT_I)}>
          Investissement: {formatCurrency(credit_i)}
        </li>
        <li class="f" style:color="coral" on:click={() => select(CREDIT_F)}>
          Fonctionnement: {formatCurrency(credit_f)}
        </li>
        <li class="total">Total: {formatCurrency(credit_i + credit_f)}</li>
      </ul>
    </figcaption>
  </figure>
  <figure class="container">
    <Donut
      scale={debit / max}
      data={[
        {
          id: BudgetType.DEBIT_I,
          label: FILabel.I,
          value: debit_i,
          color: sand,
        },
        {
          id: BudgetType.DEBIT_F,
          label: FILabel.F,
          value: debit_f,
          color: water,
        },
      ]}
      on:click={data => select(data.detail.id)}
    />
    <figcaption>
      <div>Dépenses</div>
      <ul class="visually-hidden">
        <li
          class="i"
          style:color="cornflowerblue"
          on:click={() => select(DEBIT_I)}
        >
          Investissement: {formatCurrency(debit_i)}
        </li>
        <li class="f" style:color="#E57F84" on:click={() => select(DEBIT_F)}>
          Fonctionnement: {formatCurrency(debit_f)}
        </li>
        <li>Total: {formatCurrency(debit_i + debit_f)}</li>
      </ul>
    </figcaption>
  </figure>
</div>

<style lang="sass">
  .Debit-Credit
    flex: 1 0
    display: flex
    align-items: center
    justify-content: center
    gap: 8.5rem
    width: 100%
    font-size: 1.5rem
    text-align: center
</style>
