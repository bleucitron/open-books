<script lang="ts">
  import { makeCSV } from '@utils';

  import type { Budget } from '@interfaces';

  import Icon from '$lib/Icon.svelte';

  export let data: Budget;

  $: csvP = makeCSV(data);
</script>

<div class="Csv">
  {#await csvP then csv}
    <a href={csv.url} download={csv.file}>
      <Icon id="download" />
    </a>
  {/await}
</div>

<style lang="sass">
  .Csv
    position: absolute
    right: 0
    top: 0
    display: flex
    align-items: center
    font-size: 1.7rem

    a
      display: flex
      justify-content: center
      align-items: center
      width: 2.2rem
      height: 2.2rem
      border-radius: 50%
      cursor: pointer

      &:hover
        background: coral

        :global(.Icon)
          color: white

      :global(.Icon)
        color: #999
</style>
