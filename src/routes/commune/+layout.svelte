<script lang="ts">
  import type { LayoutData } from './$types';
  import Header from '$lib/Header.svelte';
  import FavoriteToggle from '$lib/FavoriteToggle.svelte';
  import Search from '$lib/Search.svelte';

  import { page } from '$app/stores';

  import { formatValue } from '@utils/misc';
  import { handleTargetSelection } from '../(general)/utils';

  export let data: LayoutData;

  $: ({ city } = data);
  $: ({ nom, departement, population } = city);

  $: insee = $page.params.insee;
</script>

<svelte:head>
  <title>
    {`Budgets pour ${nom} ${departement ? `(${departement.code})` : ''}`}
  </title>
</svelte:head>
<div class="budget-layout">
  <Header>
    <div class="titles">
      <FavoriteToggle name={nom} {insee} data={{ city }} />
      <h1>{nom}</h1>
      {#if city}
        <div class="info">
          <span>{formatValue(population)} habitants</span>
          <span>
            ({nom} - {departement?.code})
          </span>
        </div>
      {/if}
    </div>

    <Search on:select={({ detail }) => handleTargetSelection(detail)} />
  </Header>
</div>

<main>
  <slot />
</main>

<style lang="sass">
  .budget-layout
    .titles
      display: flex
      align-items: baseline

    h1
      font-size: 2rem
      color: $grey-lightest
      margin-right: 0.5rem

    .info
      margin: 0
      display: flex
      align-items: flex-end

      span:first-child
        margin-right: 3px

      span:last-child
        margin-left: 3px

    :global
      header
        .slot-container
          justify-content: space-between

        .Search
          width: 25em
          height: 100%
          border-radius: 0
          overflow: unset

          input, .mode
            font-size: 0.9em
            height: 100%

            &::placeholder
              color: $grey-dark

            &:focus::placeholder
              color: $grey

          menu button
            font-size: 0.8em

        .searchbar
          height: 100%
          background: $grey-darker
          font-size: 1.1rem

          &:focus-within
            background: $grey-dark

        .Suggestion
          font-size: 0.8em

  main
    padding-top: $headerHeight
    height: 100vh
</style>
