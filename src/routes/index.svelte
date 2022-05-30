<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';
  import { getRandomCities } from '@api/geo';
  import { city as cityStore } from '@stores';
  import type { City } from '@interfaces';
  import { redirectToBudget } from './_utils';

  import Icon from '$lib/Icon.svelte';
  import Search from '$lib/Search.svelte';
  import Spinner from '$lib/Spinner.svelte';

  export let examples: City[] = [];

  let timeout: NodeJS.Timeout;
  let retryTimeout: NodeJS.Timeout;
  let allowedToRetry = false;

  const delay = 30 * 1000; // 30 seconds
  const retryDelay = 5 * 1000; // 5 seconds

  function allowRetry(): void {
    allowedToRetry = true;
  }

  function resetTimeout(): void {
    clearTimeout(timeout);
    clearTimeout(retryTimeout);
    timeout = setTimeout(updateExamples, delay);
    retryTimeout = setTimeout(allowRetry, retryDelay);
  }

  function chooseExample(c: City): void {
    $cityStore = c;
  }

  onMount(() => {
    timeout = setTimeout(updateExamples, 3000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(retryTimeout);
    };
  });

  async function updateExamples(): Promise<void> {
    examples = await getRandomCities(10000);
    allowedToRetry = false;
    resetTimeout();
  }
</script>

<svelte:head>
  <title>Livres ouverts</title>
</svelte:head>

<main>
  <Search on:select={({ detail }) => redirectToBudget(detail)} />

  {#if examples.length}
    <div class="examples" in:fade={{ duration: 2000 }}>
      <p>
        Si l'inspiration vous manque...
        {#if allowedToRetry}
          <i in:fade={{ duration: 1000 }}>
            <Icon id="refresh-ccw" on:click={updateExamples} />
          </i>
        {/if}
      </p>
      <ul>
        {#key examples}
          {#each examples as city, i}
            {@const {
              nom,
              code,
              departement: { nom: dpt, code: dptCode },
            } = city}
            <li in:fade={{ duration: 2000, delay: i * 1000 }}>
              <a
                href={`/budgets?insee=${code}`}
                on:click={() => chooseExample(city)}
              >
                <div class="city">
                  <span>
                    {nom}
                    {#if $navigating && city === $cityStore}
                      <Spinner inline />
                    {/if}
                  </span>
                </div>
                <div class="dpt">({dpt} - {dptCode})</div>
              </a>
            </li>
          {/each}
        {/key}
      </ul>
    </div>
  {/if}
</main>

<style lang="sass">
  main
    position: relative
    display: flex
    flex-flow: column
    align-items: center
    height: 100vh
    padding-top: $headerHeight

    :global
      .Search
        margin-top: 25vh
      .Icon
        cursor: pointer

    .examples
      display: flex
      flex-flow: column
      align-items: center
      margin-top: 8rem

      p
        position: relative
        display: flex
        gap: 0.5rem
        align-items: center
        margin: 0
        font-size: 0.9rem
        text-align: center
        color: #bbb

        i
          position: absolute
          right: -1.5rem
          display: flex
          align-items: center
          transition: color 0.3s ease-in-out
          &:hover
            color: coral

      ul
        display: flex
        gap: 1.5rem
        margin: 0

      li
        padding: 0.5rem 0.7rem
        margin: 0.7rem 0
        text-align: center
        border-radius: 1em
        transition: color 0.3s ease-in-out

        &:hover,
        &:focus
          opacity: 1
          color: coral

        .city
          font-size: 1.1rem
          span
            position: relative

          :global
            .Spinner
              position: absolute
              right: -1.4rem
              bottom: 0


        .dpt
          font-size: 0.8rem
          opacity: 0.5
          font-style: italic

</style>
