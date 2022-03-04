<script lang="ts">
  let value = '';
  const handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    value = target.value;
  };
</script>

<input type="text" bind:value on:input={handleInput} />

<div>{value}</div>
