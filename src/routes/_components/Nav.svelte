<script>
  import classnames from 'classnames';
  export let path;

  $: classes = classnames('Nav', { path });
</script>

<style lang="scss">
  nav {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    height: 2rem;
    padding: 0.5rem;
    color: black;
    z-index: 1;
  }

  a {
    margin: 0.2rem;

    opacity: 0.1;
    cursor: pointer;

    i {
      font-size: 1.5rem;
      width: 2rem;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
  }

  a:hover {
    opacity: 0.8;
  }
</style>

<nav class={classes}>
  <a href="/">Accueil</a>
  <a href="/about">À propos</a>
  <a class="github" href="https://github.com/iOiurson/open-books">
    <i class="fab fa-github" />
  </a>
</nav>
