<script>
  import classnames from 'classnames';
  export let path;
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

    opacity: 0.2;
    cursor: pointer;

    &:hover {
      color: darkorchid;
      opacity: 0.8;
    }

    &.current {
      opacity: 1;

      &:hover {
        color: unset;
        opacity: unset;
        cursor: unset;
      }
    }

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
</style>

<nav class="Nav">
  <a href="/" class={classnames({ current: path === 'home' })}>Accueil</a>
  <a href="/about" class={classnames({ current: path === 'about' })}>
    À propos
  </a>
  <a href="https://github.com/iOiurson/open-books">
    <i class="fab fa-github" />
  </a>
</nav>
