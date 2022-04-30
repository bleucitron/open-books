<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { quadOut } from 'svelte/easing';
  import { formatCurrency } from '@utils';
  import LoadingText from '$lib/LoadingText.svelte';

  export let year: number;
  export let valueP: Promise<number> = undefined;
  export let maxP: Promise<number>;
  export let select: () => void = undefined;
  export let selected = false;

  let height = tweened(0, { easing: quadOut });
  let pending = true;
  let unavailable = false;

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
  class:pending
  class:unavailable
  class:selected
  on:click={!unavailable ? select : undefined}
>
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
</li>

<style lang="sass">
  .Year
    flex: 1 0
    display: flex
    flex-flow: column
    justify-content: flex-end
    align-items: stretch
    height: 10rem
    max-width: 4.5rem
    font-size: 0.8rem
    color: #333
    opacity: 0.5
    cursor: pointer

    &:hover:not(.unavailable):not(.selected)
      opacity: 0.7
      :global(h3)
        color: cornflowerblue

      .value
        background: cornflowerblue

    &.selected
      opacity: 1
      :global(h3)
        color: cornflowerblue

      .value
        background: cornflowerblue

    &:first-child
      margin-left: 0

    &:last-child
      margin-right: 0

  .container
    flex: 1 0
    display: flex
    flex-flow: column
    justify-content: flex-end

  .value
    flex: 0 0
    display: flex
    flex-flow: column
    align-items: center
    padding: 3px
    background: #666
    color: #eee
    border-radius: 8px

  .unavailable
    opacity: 0.2
    cursor: default

  .pending
    opacity: 0.3
</style>
