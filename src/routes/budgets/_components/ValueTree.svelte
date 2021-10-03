<script lang="ts">
  import { format } from 'd3-format';

  import type { BudgetRecord, FonctionTree } from '@interfaces';
  import { aggregateData, formatFullValue, sumBy, BudgetCode } from '@utils';
  export let records: BudgetRecord[];
  export let tree: FonctionTree;
  export let selectedCode: string;

  $: fonctions = Object.values(aggregateData(records, tree as FonctionTree));
  // $: console.log('records', records.length);

  $: debitTotal = sumBy(records, BudgetCode.OBNETDEB);
  $: creditTotal = sumBy(records, BudgetCode.OBNETCRE);

  function select(c: string): void {
    selectedCode = c;
  }

  $: checkVisible = (code: string): boolean => {
    const noSelection = !selectedCode && code.length === 1;
    const isSelected = selectedCode === code;

    const isDirectChild =
      code.startsWith(selectedCode) && code.length === selectedCode.length + 1;

    const visible = isSelected || noSelection || isDirectChild;
    return visible;
  };
</script>

<div class="chart">
  {#each fonctions as { code, label, value: { obnetdeb: debit, obnetcre: credit }, subTree }}
    <div
      class="fonction"
      class:visible={checkVisible(code)}
      on:click={() => select(code)}
    >
      <h3>{code} {label}</h3>
      <div class="value">
        Debit
        <span>{`${formatFullValue(debit)}`}</span>
        {`${format('.2%')(debit / debitTotal)}`}
      </div>
      <div class="value">
        Credit
        <span>{`${formatFullValue(credit)}`}</span>
        {`${format('.2%')(credit / creditTotal)}`}
      </div>
      {#if subTree}
        <svelte:self
          records={records.filter(
            d => d.fonction && d.fonction.startsWith(code),
          )}
          tree={subTree}
          {selectedCode}
        />
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .chart {
    margin-left: 2rem;
    width: 70%;
  }

  .fonction {
    display: none;
  }
  .visible {
    display: block;
  }

  h3 {
    margin-top: 1rem;
  }
  span {
    font-weight: bold;
  }

  .value {
    margin-left: 2rem;
  }
</style>
