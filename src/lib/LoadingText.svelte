<script lang="ts">
  export let text: string;
  export let loading = false;
</script>

<div class="LoadingText" class:loading>{text}</div>

<style lang="sass">
  @keyframes animate-premium
    0%
      background-position: -500%
    100%
      background-position: 500%

  .LoadingText
    margin-top: 0.5rem
    font-size: 1rem
    text-align: center

  .loading
    color: $grey-darkest
    overflow: hidden
    background-color: $grey-darkest
    background-image: linear-gradient(43deg, $grey-darkest 0%, white 46%, $grey-darkest 100%)
    background-repeat: no-repeat
    background-size: 80%
    animation: animate-premium 3s linear infinite
    -webkit-text-fill-color: rgba(255, 255, 255, 0.1)
    background-clip: text
    -webkit-background-clip: text
</style>
