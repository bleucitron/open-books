<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import LoadingText from '../lib/LoadingText.svelte';
</script>

<Meta title="Text" component={LoadingText} />

<Story name="LoadingText Component">
  <LoadingText text="Chargement en cours ..." loading />
</Story>
