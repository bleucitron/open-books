<script lang="ts">
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  import Spinner from '$lib/Spinner.svelte';

  import { changingCity } from '@stores';
  import type { Budget } from '@interfaces';

  export let labels: Budget[];
  export let loadingP: Promise<unknown>;

  const defaultLabel = 'commune';

  function makeUrl(siret: string): string {
    const url = new URL($page.url);
    url.searchParams.set('year', currentYear);
    url.searchParams.set('siret', siret);

    return url.href;
  }

  $: currentYear = $page.url.searchParams.get('year');
  $: currentSiret = $page.url.searchParams.get('siret');

  $: sirens = [...new Set(labels.map(({ siren }) => siren))];
</script>

<ul class="Labels">
  {#if !$changingCity}
    {#await loadingP}
      <div class="loading">
        <Spinner />
      </div>
    {/await}
    {#each sirens as siren}
      <li class="siren">
        <ul>
          {#each labels.filter(l => l.siren === siren) as { siret, siren, etabl, label }, i}
            <li
              class="siret"
              class:selected={currentSiret === siret}
              class:main={i === 0}
              in:fade|local
            >
              <a href={makeUrl(siret)}>
                <div class="info">
                  <span class="siren">{siren}</span>
                  <span class="etabl">{etabl}</span>
                </div>
                <div class="label">{label || defaultLabel}</div>
              </a>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  {/if}
</ul>

<style lang="sass">
  .Labels
    position: relative
    display: flex
    flex-flow: column
    width: 15rem
    padding-right: 1rem
    margin: 0
    color: $grey-lightest
    overflow: auto

    li.siren
      border-top: 1px solid $grey-dark
      margin-bottom: 2rem

      &:first-of-type
        border: none

    li.siret
      text-transform: capitalize
      font-size: 1rem
      text-align: right
      padding: 0.25rem 0
      opacity: 0.2
      cursor: pointer

      &:not(.main) .siren
        opacity: 0

      &:hover
        opacity: 0.7

        .info
          opacity: 0.4

        .siren
          opacity: 1

      &.selected
        pointer-events: none
        cursor: default
        opacity: 1

        .info
          opacity: 0.4

        .siren
          opacity: 1

      .info
        opacity: 0.6
        font-size: 0.7rem

    .loading
      position: absolute
      top: 0
      left: 0
</style>
