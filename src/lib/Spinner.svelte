<script lang="ts">
  import Icon from './Icon.svelte';
  export let inline = false;
</script>

<div class="Spinner" class:inline>
  <Icon id="loader" />
</div>

<style lang="sass">
  @keyframes rotate-loader
    from
      transform: rotate(0)

    to
      transform: rotate(360deg)

  .Spinner
    display: flex
    justify-content: center
    align-items: center
    font-size: var(--size, 1em)

    animation: rotate-loader 1.5s linear infinite

    &.inline
      display: inline-flex
</style>
