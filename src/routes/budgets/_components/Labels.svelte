<script lang="ts">
  import Spinner from '$lib/Spinner.svelte';

  import type { Budget } from '@interfaces';

  export let labels: Budget[];
  export let select: (y: string) => void;
  export let selected: string;
  export let loadingP: Promise<unknown>;

  const defaultLabel = 'commune';

  $: sirens = [...new Set(labels.map(({ siren }) => siren))];
</script>

<ul class="Labels">
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
            class:selected={selected === siret}
            class:main={i === 0}
          >
            <div on:click={() => select(siret)}>
              <div class="info">
                <span class="siren">{siren}</span>
                <span class="etabl">{etabl}</span>
              </div>
              <div class="label">{label || defaultLabel}</div>
            </div>
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<style lang="sass">
  .Labels
    position: relative
    display: flex
    flex-flow: column
    width: 15rem
    margin: 0

    li.siren
      border-top: 1px solid rgba(white, 0.1)
      margin-bottom: 0.5rem

      &:first-of-type
        border: none

    li.siret
      text-transform: capitalize
      font-size: 1rem
      text-align: right
      padding: 0.25rem 0

      > div
        opacity: 0.2
        cursor: pointer

        &:hover
          opacity: 0.7

          .info
            opacity: 0.4

          .siren
            opacity: 1

      &.selected
        pointer-events: none
        cursor: default

        > div
          opacity: 1
          color: cornflowerblue

          .info
            opacity: 0.4

          .siren
            opacity: 1

      .info
        opacity: 0.6
        font-size: 0.7rem

      &:not(.main) .siren
        opacity: 0

    .loading
      position: absolute
      top: 0
      left: 0
</style>
