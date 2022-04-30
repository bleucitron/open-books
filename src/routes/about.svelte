<script lang="ts">
  import { marked } from 'marked';
  import { html } from '@docs/about.md';

  const content = marked.parse(html);
</script>

<svelte:head>
  <title>À propos de Livres ouverts</title>
</svelte:head>

<main class="md">
  {@html content}
</main>

<style lang="sass">
  main
    max-width: 70ch
    margin-inline: auto
    padding-top: 2rem
    padding-bottom: 5rem
    padding-inline: 2rem
    flex: 1 0
    overflow-y: scroll

  @media (max-width: 480px)
    main
      padding: 2rem

  :global
    +md
</style>
