<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Search from '../routes/home/_components/Search.svelte';

  function handleSearch(event) {
    console.log(event.detail.city);
  }
</script>

<Meta
  title="Search"
  argTypes={{ select: { action: 'clicked' } }}
  parameters={{
    actions: {
      handles: ['search'],
    },
  }}
/>

<Template let:args>
  <Search on:select={handleSearch} {...args} />
</Template>

<Story
  name="Basic"
  parameters={{
    layout: 'centered',
  }}
/>
