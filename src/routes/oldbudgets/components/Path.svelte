<script lang="ts">
  import { page } from '$app/stores';
  import Icon from '$lib/Icon.svelte';

  export let steps: { id: string; label: string }[];

  function makeUrl(url: URL, code: string): string {
    const u = new URL(url);

    if (!code) u.searchParams.delete('code');
    else u.searchParams.set('code', code);

    return u.toString();
  }

  $: previous = steps.slice(0, -1);
  $: current = steps.at(-1)?.label;
</script>

<div class="Path">
  {#if current}
    <div class="current">{current}</div>
  {/if}
  <div class="steps">
    {#each previous as { id, label }}
      <a href={makeUrl($page.url, id)} class="step">
        {label}
        <Icon id="chevron-right" />
      </a>
    {/each}
  </div>
</div>

<style lang="sass">
  .Path
    flex: 1 0
    display: flex
    flex-flow: column-reverse

    .steps
      display: flex
      font-size: 0.9rem

    .step
      &:hover
        color: coral
        cursor: pointer

      :global(.Icon)
        font-size: 1.2em
        vertical-align: text-bottom

    .current
      font-size: 2rem
      line-height: 1.8rem
</style>
