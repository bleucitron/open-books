<script lang="ts">
  import Icon from './Icon.svelte';

  export let path: string;
</script>

<header>
  <a href="/" class="home" class:current={path === 'home'}>
    <div>
      <Icon id="book-open" />
      <h1>Livres ouverts</h1>
      <h2>Les données budgétaires des communes</h2>
    </div>
  </a>
  <nav class="Nav">
    <a href="/about" class:current={path === 'about'}>À propos</a>
    <a href="https://github.com/iOiurson/open-books">
      <Icon id="github" />
    </a>
  </nav>
</header>

<style lang="scss">
  header {
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

    :global(.Icon) {
      align-self: center;
    }

    > div {
      display: flex;
      align-items: baseline;
    }

    h1 {
      color: black;
      margin: 0 0.5rem;
      font-size: 1.4rem;
    }

    h2 {
      color: #bbb;
      font-size: 1rem;
      display: flex;
      align-items: center;
    }
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
    background: white;
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
