<script lang="ts">
  import type { Type } from '@interfaces';

  import { formatValue, BudgetType } from '@utils';

  export let credit: number;
  export let debit: number;
  export let select: (t: BudgetType) => void;

  let hover: Type;

  $: max = Math.max(debit, credit);

  $: makeCustomStyle = (value: number) => {
    const size = value / max;

    return `
    width:${size * 100}%;
    height:${size * 100}%;
    font-size: ${size}em;
    `;
  };
</script>

<div class="debit-credit">
  <div class="credit" on:click={() => select(BudgetType.CREDIT)}>
    <div class="value-container">
      <div
        class="value"
        style={makeCustomStyle(credit)}
        class:not-hover={hover && hover !== BudgetType.CREDIT}
        on:mouseenter={() => (hover = BudgetType.CREDIT)}
        on:mouseleave={() => (hover = undefined)}
      >
        {formatValue(credit)}
      </div>
    </div>
    <h4>Recettes</h4>
  </div>
  <div class="debit" on:click={() => select(BudgetType.DEBIT)}>
    <div class="value-container">
      <div
        class="value"
        style={makeCustomStyle(debit)}
        class:not-hover={hover && hover !== BudgetType.DEBIT}
        on:mouseenter={() => (hover = BudgetType.DEBIT)}
        on:mouseleave={() => (hover = undefined)}
      >
        {formatValue(debit)}
      </div>
    </div>
    <h4>Dépenses</h4>
  </div>
</div>

<style lang="scss">
  .debit-credit {
    flex: 1 0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .debit,
  .credit {
    text-align: center;
    width: 40%;
    margin: 0 1rem;

    .value {
      cursor: pointer;
    }
  }

  .debit {
    .value {
      background: #467fa6;
    }
  }

  .credit {
    .value {
      background: #a64672;
    }
  }

  .not-hover {
    opacity: 0.4;
  }

  h4 {
    font-size: 1.5rem;
    margin: 1rem;
  }

  .value-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15rem;
    width: 15rem;
    font-size: 3.5rem;
    margin: 0 auto;
  }

  .value {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-radius: 50%;
    background: goldenrod;
    color: white;
  }
</style>
