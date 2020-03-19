<script>
  export let search;
  export let searching;

  function handleInput(e) {
    const text = e.target.value;
    search(text);
    value = text;
  }

  let value = '';
</script>

<style>
  .searchbar {
    display: flex;
  }

  input {
    flex: 1 0;
    outline: none;
    font-size: 2rem;
    font-size: Raleway;
    border: none;
    border-bottom: 1px solid transparent;
  }

  input:focus {
    border-bottom: 1px solid black;
  }

  input::placeholder {
    color: #bbb;
  }
</style>

<div>
  <div class="searchbar">
    <div>{searching}</div>
    <input on:input="{handleInput}" placeholder="Entrez une ville" />
  </div>
  <slot></slot>
</div>
