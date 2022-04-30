<script lang="ts">
  /*
    Le code se basant uniquement sur la notion de fonction,
    les opérations sans fonction n'apparaissent pas dans ce détail.

    Voir la fonction aggregateData
  */

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { budget, tree, type, code } from '@stores';
  import {
    typeToLabel,
    stepsFromString,
    fonctionFromTree,
    formatCurrency,
  } from '@utils';
  import type { Type, Budget } from '@interfaces';

  import Spinner from '$lib/Spinner.svelte';
  import Csv from './Csv.svelte';
  import Path from './Path.svelte';
  import DebitOrCredit from './DebitOrCredit.svelte';
  import BudgetHisto from './BudgetHisto.svelte';

  export let budgetP: Promise<Budget>;
  export let year: number;

  let steps: { id: string; label: string }[];

  function updateUrl(): void {
    const u = new URL(url);

    if (!$code) u.searchParams.delete('code');
    else u.searchParams.set('code', $code);

    if (!$type) u.searchParams.delete('type');
    else u.searchParams.set('type', $type);

    goto(u.href);
  }

  function selectType(t: Type): void {
    $type = t;
    $code = null;
    updateUrl();
  }
  function selectCode(c: string): void {
    $code = c;
    updateUrl();
  }

  function reset(): void {
    $type = null;
    $code = null;
    updateUrl();
  }

  $: ({ url } = $page);
  $: $code = url.searchParams.get('code');
  $: $type = url.searchParams.get('type') as Type;

  $: steps = $budget
    ? stepsFromString($code).map(code => {
        const fonction = fonctionFromTree(code, $budget.tree);
        const { short, label } = fonction ?? {};

        return {
          id: code,
          label: short || label,
        };
      })
    : [];
  $: steps = $type ? [{ id: null, label: typeToLabel[$type] }, ...steps] : [];
  $: values = ($tree && Object.values($tree.tree ?? {})) ?? [];
  $: total = $tree ? $tree.value[$type] : 0;
</script>

<div class="Summary">
  <header>
    <h3 class:clickable={steps.length > 0} on:click={reset}>{year}</h3>
    {#await budgetP then budget}
      <Path {steps} on:click={({ detail }) => selectCode(detail)} />
      {#if budget}
        <Csv data={budget} />
      {/if}
    {/await}
  </header>
  {#await budgetP then budget}
    {#if budget}
      <div class="nomen" title="Nomenclature M14">{budget.nomen}</div>
    {/if}
  {/await}
  <div class={`values ${$type}`}>
    {#await budgetP}
      <Spinner --size="2rem" />
    {:then budget}
      {#if !budget}
        <div class="none">Aucun budget</div>
      {:else if !$type}
        <DebitOrCredit
          credit_i={budget.value.obnetcre_i}
          credit_f={budget.value.obnetcre_f}
          debit_i={budget.value.obnetdeb_i}
          debit_f={budget.value.obnetdeb_f}
          select={selectType}
        />
      {:else if budget.tree}
        <div class="main">{formatCurrency(total)}</div>
        <BudgetHisto
          {values}
          {total}
          type={$type}
          on:click={({ detail }) => selectCode(detail)}
        />
      {:else}
        <p>Pas de plan de compte disponible</p>
      {/if}
    {/await}
  </div>
</div>

<style lang="sass">
  .Summary
    flex: 1 0
    display: flex
    flex-flow: column
    justify-content: center
    align-items: stretch
    padding: 1rem
    width: 100%
    background: white
    overflow: hidden

  :global(.Summary .Path)
    margin-left: 1rem

  header
    position: relative
    display: flex
    align-items: baseline

    h3
      margin-left: 0.5rem
      font-size: 3.5rem

      &.clickable:hover
        cursor: pointer
        color: coral

  .nomen
    position: absolute
    bottom: 1rem
    right: 1rem
    width: fit-content
    font-size: 0.9rem
    padding: 0 0.2rem
    background: $grey-lightest
    color: $grey
    border-radius: 4px
    cursor: default

  .values
    flex: 1 0
    display: flex
    flex-flow: column
    align-items: center
    width: 100%
    overflow-y: hidden

    &.obnetdeb_i
      :global
        .Bar
          .background
            background: $sand-light

          &:hover
            .background
              background: $sand
    &.obnetdeb_f
      :global
        .Bar
          .background
            background: $water-light

          &:hover
            .background
              background: $water
    &.obnetcre_i
      :global
        .Bar
          .background
            background: $sand-light

          &:hover
            .background
              background: $sand
    &.obnetcre_f
      :global
        .Bar
          .background
            background: $water-light

          &:hover
            .background
              background: $water

    .none
      display: flex
      align-items: center
      justify-content: center
      font-size: 1.5rem
      text-align: center

    .main
      font-size: 3rem
</style>
