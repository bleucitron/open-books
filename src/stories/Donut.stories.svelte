<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import Donut from '../routes/budgets/_components/Donut.svelte';
</script>

<Meta title="Chart/Donut" component={Donut} argTypes={{}} />

<Story name="Donut chart">
  <Donut
    data={[
      { label: '$', value: 75, color: 'red' },
      { label: '$', value: 25, color: 'blue' },
      { label: '$', value: 100, color: 'green' },
      { label: '$', value: 50, color: 'orange' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>

<Story name="Donut chart with large diffs">
  <Donut
    data={[
      { label: '$', value: 3500, color: 'red' },
      { label: '$', value: 2, color: 'blue' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>

<Story name="Donut chart with empty value">
  <Donut
    data={[
      { label: '$', value: 3500, color: 'red' },
      { label: '$', value: 0.0, color: 'blue' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>
