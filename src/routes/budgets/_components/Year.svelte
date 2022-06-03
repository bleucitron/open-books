<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { quadOut } from 'svelte/easing';
  import { page } from '$app/stores';
  import { formatCurrency } from '@utils';
  import LoadingText from '$lib/LoadingText.svelte';

  export let year: number;
  export let valueP: Promise<number> = undefined;
  export let maxP: Promise<number>;
  export let select: () => void = undefined;

  let height = tweened(0, { easing: quadOut });
  let pending = true;
  let unavailable = false;

  function makeHref(url: URL, year: number): string {
    const u = new URL(url);
    u.searchParams.set('year', year.toString());
    u.searchParams.set('siret', currentSiret);

    return u.href;
  }

  $: ({ url } = $page);
  $: currentYear = parseInt(url.searchParams.get('year'));
  $: currentSiret = url.searchParams.get('siret');

  $: selected = year === currentYear;

  $: valueP.then(v => {
    pending = false;
    unavailable = v == null;
  });

  $: Promise.all([valueP, maxP]).then(([v, max]) => {
    $height = ((v ?? 0) / max) * 100;
  });
</script>

<li
  class="Year"
  class:unavailable
  class:selected
  on:click={!unavailable ? select : undefined}
>
  <a href={makeHref(url, year)} class="container">
    {#await valueP then value}
      {#if value}
        <div class="container">
          <div class="value" style:flex-basis={`${$height}%`}>
            {formatCurrency(value)}
          </div>
        </div>
      {/if}
    {/await}
    <LoadingText text={year.toString()} loading={pending} />
  </a>
</li>

<style lang="sass">
  .Year
    flex: 1 0
    display: flex
    flex-flow: column
    justify-content: flex-end
    align-items: stretch
    max-width: 4.5rem
    font-size: 0.8rem
    color: $grey-darker
    opacity: 0.4
    cursor: pointer

    &:hover:not(.unavailable):not(.selected)
      opacity: 0.7

    &.selected
      opacity: 1

    &:first-child
      margin-left: 0

    &:last-child
      margin-right: 0

  .container
    height: 8rem
    display: flex
    flex-flow: column
    justify-content: flex-end

  .value
    flex: 0 0
    display: flex
    flex-flow: column
    align-items: center
    padding: 3px
    background: $grey-dark
    color: white
    border-radius: 8px

  .unavailable
    opacity: 0.1
    cursor: default
    pointer-events: none
</style>
