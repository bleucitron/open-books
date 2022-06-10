<script lang="ts">
  import { page } from '$app/stores';
  import Icon from './Icon.svelte';
</script>

<header class:budget={$page.url.pathname === '/budgets'}>
  <nav>
    <a class="home" href="/" class:current={$page.url.pathname === '/'}>
      <Icon id="book-open" />
      {#if !$$slots.default}
        <h1>
          <span>Livres ouverts</span>Les données budgétaires des communes
        </h1>
      {/if}
    </a>
    {#if $$slots.default}
      <div class="slot-container">
        <slot />
      </div>
    {/if}

    <span class="other">
      <a
        class="about"
        href="/about"
        title="À propos"
        class:current={$page.url.pathname === '/about'}
      >
        <Icon id="info" />
        <span>À propos</span>
      </a>
      <a href="https://github.com/iOiurson/open-books" title="Github">
        <Icon id="github" />
        <span>Source</span>
      </a>
    </span>
  </nav>
</header>

<style lang="sass">
  header
    position: fixed
    width: 100vw
    display: flex
    height: $headerHeight
    background-color: white
    z-index: 10
    box-shadow: 0px 0px 10px 5px white

    &.budget
      background: $grey-darkest
      color: $grey-dark
      box-shadow: none

      nav
        .home
          h1
            color: $grey-darker
            span
              color: $grey-dark

          :global(.Icon)
            color: $grey-dark

        a:not(.home)
          span
            display: none

    nav
      display: flex
      justify-content: space-between
      align-items: stretch
      height: 100%
      width: 100%
      z-index: 1

      .home
        font-size: 1.5rem
        display: flex
        align-items: center
        height: 100%
        font-size: 1.6rem
        margin-inline: 0.75rem

        :global(.Icon)
          align-self: center

        h1
          color: $grey-light
          font-size: 1rem
          display: flex
          align-items: baseline

          span
            color: $grey-darkest
            margin: 0 0.5rem
            font-size: 1.4rem

      a
        display: inline-flex
        transition: color 0.3s ease-in-out

        &:not(.home)
          align-items: center
          gap: 0.3em

        &:hover:not(.current)
          color: coral

        &.current
          color: cornflowerblue
          cursor: unset

          &:hover
            color: cornflowerblue
            opacity: unset

    .slot-container
      flex: 1
      display: flex
      align-items: center

    .other
      display: flex
      align-items: center
      margin-inline: 0.5rem

      a
        padding-inline: 0.5rem
</style>
