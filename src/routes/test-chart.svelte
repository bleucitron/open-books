<script lang="ts">
  import Summary from './budgets/_components/Summary.svelte';
  import ValueTree from './budgets/_components/ValueTree.svelte';
  import budget from '../../data/budget_Bordeaux_2019.json';
  import initialTree from '../../data/fonctionsTree_M14_COM_SUP3500_2020.json';
</script>

<div class="container">

  <Summary budgetP={Promise.resolve(budget)} year={2019} />
</div>
<!-- <ValueTree records={budget.records} tree={initialTree} /> -->

<style lang="scss">
  .container {
    display: flex;
    flex: 1 0;
    overflow: hidden;

    padding: 1rem;
  }
</style>
