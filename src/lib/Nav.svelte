<script lang="ts">
  import Icon from './Icon.svelte';
  import HistoryMenu from './HistoryMenu.svelte';
  import FavoriteMenu from './FavoriteMenu.svelte';

  export let path: string;
</script>

<header>
  <a href="/" class="home" class:current={path === 'home'}>
    <div>
      <Icon id="book-open" />
      <div class="main">Livres ouverts</div>
      <h1>Les données budgétaires des communes</h1>
    </div>
  </a>
  <nav class="Nav">
    <a class="about" href="/about" class:current={path === 'about'}>À propos</a>
    <HistoryMenu />
    <FavoriteMenu />
    <a href="https://github.com/iOiurson/open-books">
      <Icon id="github" />
    </a>
  </nav>
</header>

<style lang="sass">
  header
    position: fixed
    width: 100vw
    display: flex
    justify-content: space-between
    height: $headerHeight
    padding: 0.7rem 1rem
    background-color: white
    z-index: 10
    box-shadow: 0px 0px 10px 5px white

  a
    display: flex
    align-items: center
    cursor: pointer
    transition: color 0.3s ease-in-out

    &:hover
      color: coral

    &.current
      color: cornflowerblue
      cursor: unset

      &:hover
        color: cornflowerblue
        opacity: unset

  .home
    font-size: 1.5rem

    :global(.Icon)
      align-self: center

    > div
      display: flex
      align-items: baseline

    .main
      color: $grey-darkest
      margin: 0 0.5rem
      font-size: 1.4rem

    h1
      color: $grey-light
      font-size: 1rem
      display: flex
      align-items: center

  nav
    display: flex
    justify-content: flex-end
    gap: 1rem
    padding-inline: 0.5rem
    color: $grey-darkest
    background: white
    z-index: 1

    a
      transition: color 0.3s ease-in-out

      &:hover
        color: coral

      &.current
        color: cornflowerblue
        cursor: unset

        &:hover
          color: cornflowerblue
          opacity: unset
</style>
