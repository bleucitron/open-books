<script>
  import classnames from 'classnames';
  export let home;

  $: classes = classnames('Nav', { home });
</script>

<style lang='scss'>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2rem;
    padding: 0.5rem;
    color: white;
    z-index: 1;

    &.home {
      color: black;
    }
  }

  a {
    position: absolute;
    top: 0;
    font-size: 1.5rem;
    width: 2rem;
    height: 2rem;
    margin: 0.2rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.1;
    cursor: pointer;

    &.github {
      right: 0;
    }

    &.back {
      left: 0;
    }
  }

  a:hover {
    opacity: 0.8;
  }
</style>

<nav class={classes}>
  {#if !home}
    <a class='back' href="/">
      <i class="fas fa-arrow-left" />
    </a>
  {/if}
  <a class='github' href="https://github.com/iOiurson/open-books">
    <i class="fab fa-github" />
  </a>
</nav>
