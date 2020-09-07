<script lang="ts">
  import { Circle } from 'svelte-loading-spinners';

  export let color = 'white';
  export let size = '1';
  export let unit = 'rem';
</script>

<style lang="scss">
  .Spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0;
  }
</style>

<div class="Spinner">
  <Circle {color} {size} {unit} />
</div>
