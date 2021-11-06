<script>
  import Icon from './_components/Icon.svelte';

  let active = false;
</script>

<h1>icons</h1>
<div on:click={() => (active = !active)}>
  <Icon id="heart" filled color={active ? 'red' : 'grey'} />
</div>

<style lang="scss">
  div {
    font-size: 10em;
  }
</style>
