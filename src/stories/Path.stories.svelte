<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import { action } from '@storybook/addon-actions';
  import Path from '../routes/budgets/components/Path.svelte';

  const steps = [
    { label: 'Step 1', select: () => action('select')('step 1') },
    { label: 'Step 2', select: () => action('select')('step 2') },
    { label: 'Step 3', select: () => action('select')('step 3') },
  ];
</script>

<Meta title="Budget/Path" component={Path} />

<Story
  name="Basic"
  parameters={{
    layout: 'centered',
  }}
>
  <Path {steps} />
</Story>
