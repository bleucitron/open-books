<script>
  import classnames from 'classnames';
  export let path;
</script>

<style lang="scss">
  header {
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 3rem;
  }

  a {
    display: flex;
    align-items: center;
    margin: 0 0.5rem;
    cursor: pointer;
  }

  .home {
    font-size: 1.5rem;
  }

  a {
    transition: color 0.3s ease-in-out;

    &:hover {
      color: coral;
    }

    &.current {
      color: cornflowerblue;
      cursor: unset;

      &:hover {
        color: cornflowerblue;
        opacity: unset;
      }
    }
  }

  nav {
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    padding: 0.5rem;
    color: black;
    z-index: 1;

    a {
      transition: color 0.3s ease-in-out;

      &:hover {
        color: coral;
      }

      &.current {
        color: cornflowerblue;
        cursor: unset;

        &:hover {
          color: cornflowerblue;
          opacity: unset;
        }
      }

      i {
        font-size: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
      }
    }
  }
</style>

<header>
  <a href="/" class={classnames('home', { current: path === 'home' })}>
    <i class="fas fa-book-open" />
  </a>
  <nav class="Nav">
    <a href="/about" class={classnames({ current: path === 'about' })}>
      À propos
    </a>
    <a href="https://github.com/iOiurson/open-books">
      <i class="fab fa-github" />
    </a>
  </nav>
</header>
