<script context="module" lang="ts">
  import type { ErrorLoad } from '@sveltejs/kit';

  export const load: ErrorLoad = ({ error, status }) => {
    return {
      props: {
        code: status,
        message: error.message,
      },
    };
  };
</script>

<script lang="ts">
  export let message: string;
  export let code: number;
  $: title = `${code}: ${message}`;
</script>

<h1>{title}</h1>

<svelte:head>
  <title>{code}</title>
</svelte:head>

<h1>{code}</h1>

<p>{message}</p>

<style lang="scss">
  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
