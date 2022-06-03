<script lang="ts">
  /*
    Le code se basant uniquement sur la notion de fonction,
    les opérations sans fonction n'apparaissent pas dans ce détail.

    Voir la fonction aggregateData
  */

  import { browser } from '$app/env';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { type, code } from '@stores';
  import {
    typeToLabel,
    stepsFromString,
    fonctionFromTree,
    formatCurrency,
    BudgetType,
  } from '@utils';
  import type { Type, Budget, FonctionTreeValue } from '@interfaces';

  import Csv from './Csv.svelte';
  import Path from './Path.svelte';
  import DebitOrCredit from './DebitOrCredit.svelte';
  import BudgetHisto from './BudgetHisto.svelte';

  export let budget: Budget;
  export let year: number;

  let breadcrumbs: { id: string; label: string }[];

  function selectType(type: BudgetType): void {
    const u = new URL(url);

    if (!type) u.searchParams.delete('type');
    else u.searchParams.set('type', type);

    // not sure if i can use an <a> with a <path>
    goto(u.href);
  }

  function makeResetHref(url: URL): string {
    const u = new URL(url);
    u.searchParams.delete('type');
    u.searchParams.delete('code');

    return u.href;
  }

  $: ({ url } = $page);
  $: if (browser) {
    code.set(url.searchParams.get('code'));
    type.set(url.searchParams.get('type') as Type);
  }

  $: steps = budget ? stepsFromString($code) : [];
  $: breadcrumbs = steps.map(code => {
    const fonction = fonctionFromTree(code, budget.tree);
    const { short, label } = fonction ?? {};

    return {
      id: code,
      label: short || label,
    };
  });
  $: breadcrumbs = $type
    ? [{ id: null, label: typeToLabel[$type] }, ...breadcrumbs]
    : [];

  $: data = steps.reduce<Budget | FonctionTreeValue>(
    (acc, cur) => acc.tree[cur],
    budget,
  );
  $: values = (data?.tree && Object.values(data.tree ?? {})) ?? [];
  $: total = data ? data?.value[$type] : 0;
</script>

<div class="Summary">
  <header>
    <h3 class:clickable={$type}><a href={makeResetHref(url)}>{year}</a></h3>
    <Path steps={breadcrumbs} />
    {#if budget}
      <Csv data={budget} />
    {/if}
  </header>
  {#if budget}
    <div class="nomen" title="Nomenclature M14">{budget.nomen}</div>
  {/if}
  <div class={`values ${$type}`}>
    {#if !budget}
      <div class="none">Aucun budget</div>
    {:else if !budget.tree}
      <div class="none">
        Pas de plan de compte disponible
        <p>Nous ne pouvons pas analyser la structure du budget.</p>
        <p>
          Vous pouvez néanmoins
          <Csv data={budget}>télécharger le fichier du budget</Csv>.
        </p>
      </div>
    {:else if !$type}
      <DebitOrCredit
        credit_i={budget.value.obnetcre_i}
        credit_f={budget.value.obnetcre_f}
        debit_i={budget.value.obnetdeb_i}
        debit_f={budget.value.obnetdeb_f}
        select={selectType}
      />
    {:else}
      <div class="main">{formatCurrency(total)}</div>
      <BudgetHisto {values} {total} type={$type} />
    {/if}
    <!-- {/await} -->
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
    padding-bottom: 0
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

    :global
      .Csv
        position: absolute
        right: 0
        top: 0

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
    justify-content: center
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
      font-size: 1.5rem
      text-align: center

      p
        font-size: initial

    .main
      margin-block: 0.5rem
      font-size: 3rem
</style>
