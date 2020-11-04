<script lang="ts">
  import ChartManager from './budgets/_components/ChartManager.svelte';
  import ValueTree from './budgets/_components/ValueTree.svelte';
  import budget from '../../data/budget_Bordeaux_2019.json';
  import initialTree from '../../data/fonctionsTree_M14_COM_SUP3500_2020.json';
</script>

<ChartManager {budget} tree={initialTree} />
<ValueTree records={budget.records} tree={initialTree} />
