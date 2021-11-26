<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
  import { loop_guard } from 'svelte/internal';
  import PieChartBudget from '../routes/budgets/_components/PieChartBudget.svelte';
</script>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta title="Chart/Pie" component={PieChartBudget} argTypes={{}} />

<Story name="Pie Chart">
  <PieChartBudget
    radius={100}
    data={[
      { label: '$', value: 65, color: 'black' },
      { label: '$', value: 35 },
    ]}
    on:slice-click={data => console.log(data.detail)}
    on:slice-hover={data => console.log(data.detail)}
  />
  <PieChartBudget
    radius={100}
    data={[
      { label: '$', value: 8, color: 'black' },
      { label: '$', value: 15, color: 'red' },
    ]}
    on:slice-click={data => console.log(data.detail)}
    on:slice-hover={data => console.log(data.detail)}
  />
</Story>
