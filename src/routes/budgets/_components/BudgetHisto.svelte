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

<div class="BudgetHisto">
  <div class="content">
    {#each values as { code, label, value, tree }}
      {@const percentage = total ? value[type] / total : 0}

      <Bar
        {label}
        value={value[type]}
        {percentage}
        width={percentage}
        hasMore={!!tree}
        on:click={() => dispatch('click', code)}
      />
    {/each}
  </div>
</div>

<style lang="sass">
  .BudgetHisto
    flex: 1 0
    display: flex
    flex-direction: column
    width: 100%
    overflow-y: scroll

    .content
      margin-inline: auto
      width: 80%
      max-width: 40rem
</style>
