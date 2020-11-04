<script lang="ts">
  import Charts from './Charts.svelte';
  import type {
    Budget,
    FonctionTree,
    FonctionTreeValue,
  } from '../../../interfaces';
  import {
    aggregateData,
    formatValue,
    pathFromString,
    fonctionFromTree,
    BudgetType,
  } from '../../../utils';

  export let budget: Budget;
  export let tree: FonctionTree;

  let type: BudgetType;
  // let type: BudgetType = BudgetType.CREDIT;
  // let type: BudgetType = BudgetType.DEBIT;
  let selectedCode: string;

  function selectType(t: BudgetType) {
    type = t;
  }
  function selectFonction(f: string) {
    selectedCode = f;
  }

  $: path = pathFromString(selectedCode);
  // $: console.log('PATH', path);

  // les opérations sans fonction ne devraient (peut-être ?) pas être comptées
  $: records = budget.records.filter(d => d.fonction);
  $: {
    if (type) {
      records =
        type === BudgetType.CREDIT
          ? records.filter(d => d.obnetcre)
          : records.filter(d => d.obnetdeb);
    }
  }
  $: {
    if (selectedCode) {
      records = records.filter(r => r.fonction?.startsWith(selectedCode));
    }
  }

  $: aggTree = aggregateData(budget.records, tree);
  $: fonction = selectedCode && fonctionFromTree(selectedCode, aggTree);
  $: fonctions = Object.values(fonction ? fonction.subTree : aggTree);

  $: values = fonctions?.map((f: FonctionTreeValue) => ({
    code: f.code,
    label: f.label,
    value: f[type],
    clickable: !!f.subTree,
  }));
</script>

{#if !type}
  <div class="values">
    <div on:click={() => selectType(BudgetType.CREDIT)} class="value credit">
      <h4>Recettes</h4>
      {formatValue(budget.credit)}
    </div>
    <div on:click={() => selectType(BudgetType.DEBIT)} class="value debit">
      <h4>Dépenses</h4>
      {formatValue(budget.debit)}
    </div>
  </div>
{:else}
  <Charts {selectFonction} {values} />
{/if}

<style>
  .values {
    flex: 1 0;
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
</style>
