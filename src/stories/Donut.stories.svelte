<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import Donut from '../routes/budgets/_components/Donut.svelte';
</script>

<Meta title="Chart/Donut" component={Donut} argTypes={{}} />

<Story name="Donut chart">
  <Donut
    data={[
      { label: '$', value: 65, color: 'red' },
      { label: '$', value: 35, color: 'blue' },
      { label: '$', value: 10, color: 'yellow' },
      { label: '$', value: 100, color: 'green' },
      { label: '$', value: 50, color: 'orange' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>
