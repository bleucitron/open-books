<script>
  import Spinner from 'svelte-spinner';

  export let color = 'white';
  export let size;
</script>

<style>
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
