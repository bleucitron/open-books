<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/Icon.svelte';

  const dispatch = createEventDispatcher();

  export let steps: { id: string; label: string }[];

  $: current = steps.pop()?.label;
</script>

<div class="Path">
  {#if current}
    <div class="current">{current}</div>
  {/if}
  <div class="steps">
    {#each steps as { id, label }}
      <div class="step" on:click={() => dispatch('click', id)}>
        {label}
        <Icon id="chevron-right" />
      </div>
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
