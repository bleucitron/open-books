<script lang="ts">
  import { Circle } from 'svelte-loading-spinners';

  export let color = '#333';
  export let size = 1;
  export let unit = 'rem';
  export let inline = false;
</script>

<div class="Spinner" class:inline>
  <Circle {color} {size} {unit} />
</div>

<style lang="scss">
  .Spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0;
  }

  .inline {
    display: inline-flex;
  }
</style>
