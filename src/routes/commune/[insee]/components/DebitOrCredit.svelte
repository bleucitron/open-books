<script lang="ts">
  import { page } from '$app/stores';
  import { formatCurrency, BudgetType, FILabel } from '@utils';
  import { sand, water } from '@utils/colors';
  import Donut from './Donut.svelte';

  const { CREDIT_I, CREDIT_F, DEBIT_I, DEBIT_F } = BudgetType;

  export let credit_i: number;
  export let credit_f: number;
  export let debit_i: number;
  export let debit_f: number;

  function makeUrl(t: BudgetType): string {
    const u = new URL($page.url);
    u.searchParams.set('type', t);

    return u.href;
  }

  $: credit = credit_f + credit_i;
  $: debit = debit_f + debit_i;
  $: credit_i_url = makeUrl(CREDIT_I);
  $: credit_f_url = makeUrl(CREDIT_F);
  $: debit_i_url = makeUrl(DEBIT_I);
  $: debit_f_url = makeUrl(DEBIT_F);

  $: max = Math.max(credit, debit);
</script>

<div class="Debit-Credit">
  <figure class="container">
    <Donut
      scale={credit / max}
      data={[
        {
          id: CREDIT_I,
          label: FILabel.I,
          value: credit_i,
          color: sand,
          url: credit_i_url,
        },
        {
          id: CREDIT_F,
          label: FILabel.F,
          value: credit_f,
          color: water,
          url: credit_f_url,
        },
      ]}
    />
    <figcaption>
      <div>Recettes</div>
      <ul class="visually-hidden">
        <li class="i" style:color="#4297A0">
          <a href={credit_i_url}>Investissement: {formatCurrency(credit_i)}</a>
        </li>
        <li class="f" style:color="coral">
          <a href={credit_f_url}>Fonctionnement: {formatCurrency(credit_f)}</a>
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
          id: DEBIT_I,
          label: FILabel.I,
          value: debit_i,
          color: sand,
          url: debit_i_url,
        },
        {
          id: DEBIT_F,
          label: FILabel.F,
          value: debit_f,
          color: water,
          url: debit_f_url,
        },
      ]}
    />
    <figcaption>
      <div>Dépenses</div>
      <ul class="visually-hidden">
        <li class="i" style:color="cornflowerblue">
          <a href={debit_i_url}>Investissement: {formatCurrency(debit_i)}</a>
        </li>
        <li class="f" style:color="#E57F84">
          <a href={debit_f_url}>Fonctionnement: {formatCurrency(debit_f)}</a>
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
