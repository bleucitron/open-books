<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Bar from './Bar.svelte';

  const dispatch = createEventDispatcher();

  import type { BudgetType } from '@utils';
  import type { FonctionTreeValue } from '@interfaces';

  export let values: FonctionTreeValue[];
  export let total: number;
  export let type: BudgetType;

  $: values.sort((v1, v2) => v2.value[type] - v1.value[type]);
</script>

<div class="budgetHisto">
  {#each values as { code, label, value, tree }}
    <Bar
      {label}
      value={value[type]}
      percentage={value[type] / total}
      width={value[type] / total}
      clickable={!!tree}
      on:click={tree ? () => dispatch('click', code) : null}
    />
  {/each}
</div>

<style lang="scss">
  .budgetHisto {
    flex: 1 0;
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    width: 70%;
    max-width: 40rem;
    overflow-y: scroll;
  }
</style>
