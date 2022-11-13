<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import Donut from '../routes/budgets/components/Donut.svelte';
</script>

<Meta title="Chart/Donut" component={Donut} argTypes={{}} />

<Story name="Donut chart">
  <Donut
    data={[
      { id: 'Rouge', value: 75, color: 'red' },
      { id: 'Bleu', value: 25, color: 'blue' },
      { id: 'Vert', value: 100, color: 'green' },
      { id: 'Orange', value: 50, color: 'orange' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>

<Story name="Donut chart with large diffs">
  <Donut
    data={[
      { id: 'Rouge', value: 3500, color: 'red' },
      { id: 'Bleu', value: 2, color: 'blue' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>

<Story name="Donut chart with empty value">
  <Donut
    data={[
      { id: 'Rouge', value: 3500, color: 'red' },
      { id: 'Bleu', value: 0.0, color: 'blue' },
    ]}
    on:click={data => console.log(data.detail)}
  />
</Story>
