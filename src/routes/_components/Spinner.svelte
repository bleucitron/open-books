<script lang="ts">
  import Spinner from 'svelte-spinner';

  export let color = 'white';
  export let size = '1.5rem';
</script>

<style lang="scss">
  .Spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 50%;
    flex: 1 0;
  }
</style>

<div class="Spinner">
  <Spinner {color} {size} />
</div>
