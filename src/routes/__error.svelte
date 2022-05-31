<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import Header from '$lib/Header.svelte';

  export const load: Load = ({ error }) => {
    console.error('Stack', error.stack);
    return {
      props: {
        message: error.message,
      },
    };
  };
</script>

<script lang="ts">
  export let message: string;
</script>

<Header />

<svelte:head>
  <title>{message}</title>
</svelte:head>

<main class="error">
  <h1>Erreur</h1>

  <p>{message}</p>
</main>

<style lang="sass">
  .error
    display: flex
    flex-flow: column
    justify-content: center
    align-items: center
    height: 100vh
    padding: 2rem
    padding-top: $headerHeight
    text-align: center

  h1,
  p
    margin: 0 auto

  h1
    font-size: 2.8em
    font-weight: 700
    margin: 0

  p
    margin: 1em auto

  @media (min-width: 480px)
    h1
      font-size: 3em
</style>
