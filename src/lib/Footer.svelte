<script lang="ts">
  import * as pack from '../../../package.json';
</script>

<footer>
  <p>
    Open Books - version {pack.version} -
    <a
      href="https://github.com/iOiurson/open-books/blob/develop/LICENSE.txt"
      target="_blank"
      ><i class="fas fa-balance-scale" />
      MIT License</a
    >
  </p>
</footer>

<style lang="scss">
  footer {
    text-align: center;
    background-color: gray;
    color: white;
  }
  p {
    margin: 0;
  }
  a {
    transition: color 0.3s ease-in-out;
    &:hover {
      color: coral;
    }
  }
</style>
