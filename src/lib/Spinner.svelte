<script lang="ts">
  import Icon from './Icon.svelte';
  export let inline = false;
</script>

<div class="Spinner" class:inline>
  <Icon id="loader" />
</div>

<style lang="scss">
  @keyframes rotate-loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .Spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0;
    &:first-child {
      animation: rotate-loader 1s linear infinite;
    }
  }

  .inline {
    display: inline-flex;
  }
</style>
