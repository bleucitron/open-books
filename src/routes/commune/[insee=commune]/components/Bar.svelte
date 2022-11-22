<script lang="ts">
  import { format } from 'd3-format';
  import { page } from '$app/stores';
  import { formatCurrency } from '@utils';

  import Icon from '$lib/Icon.svelte';

  export let code: string;
  export let value: number;
  export let percentage: number;
  export let width: number;
  export let label: string;
  export let hasMore = false;

  function makeHref(url: URL, code: string): string {
    const u = new URL(url);
    u.searchParams.set('code', code);

    return u.href;
  }
  $: ({ url } = $page);
</script>

<a href={makeHref(url, code)} class="Bar">
  <div class="labels">
    <h3>
      {label}
      {#if hasMore}
        <Icon id="more-horizontal" />
      {/if}
    </h3>
    <div class="values">
      <span class="value">{`${formatCurrency(value)}`}</span>
      <span class="percentage">{`${format('.0%')(percentage)}`}</span>
    </div>
  </div>
  <div class="background" style={`width: ${width * 100}%`} />
</a>

<style lang="sass">
  .Bar
    position: relative
    display: flex
    align-items: stretch
    padding: 0.5rem 1rem
    margin: 0.5rem
    height: 4rem
    cursor: pointer

  .labels
    display: flex
    flex-flow: column
    justify-content: space-between
    width: 100%
    z-index: 1

    :global(.Icon)
      font-size: 1.3rem
      vertical-align: middle

  h3
    font-size: 1.1rem

  .values
    display: flex
    justify-content: space-between
    align-items: baseline

  .value
    font-size: 2rem
    line-height: 1.8rem

  // .percentage
  //   font-size: 1.5rem

  .background
    position: absolute
    top: 0
    left: 0
    height: 100%
    background: $grey
    border-radius: 8px
</style>
