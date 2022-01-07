<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import PieChartBudget from '../routes/budgets/_components/PieChartBudget.svelte';
</script>

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
