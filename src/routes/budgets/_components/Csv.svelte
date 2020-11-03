<script lang="ts">
  import { makeCSV } from '../../../utils';

  import type { Budget } from '../../../interfaces';

  export let data: Budget;

  $: csvP = makeCSV(data);
</script>

<div class="Csv">
  {#await csvP then csv}
    <a href={csv.url} download={csv.file}>
      <i class="fas fa-file-download" />
    </a>
  {/await}
</div>

<style lang="scss">
  .Csv {
    position: absolute;
    right: 0;
    font-size: 1.3rem;
    top: 0;
    display: flex;
    align-items: center;
  }

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    cursor: pointer;

    i {
      color: #ddd;
    }

    &:hover {
      background: coral;
      i {
        background: coral;
        color: white;
      }
    }
  }
</style>
