<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import LoadingText from '../routes/home/_components/LoadingText.svelte';
</script>

<Meta title="Text" component={LoadingText} />

<Story name="LoadingText Component">
  <LoadingText text="Chargement en cours ..." isLoading />
</Story>
