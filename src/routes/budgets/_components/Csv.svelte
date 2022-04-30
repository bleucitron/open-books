<script lang="ts">
  import { makeCSV } from '@utils';

  import type { Budget } from '@interfaces';

  import Icon from '$lib/Icon.svelte';

  export let data: Budget;

  $: csvP = makeCSV(data);
</script>

{#await csvP then csv}
  <a class="Csv" href={csv.url} download={csv.file}>
    <slot>
      <i>
        <Icon id="download" />
      </i>
    </slot>
  </a>
{/await}

<style lang="sass">
  .Csv
    :global
      .Icon
        font-size: 1.7rem

  i
    display: flex
    justify-content: center
    align-items: center
    width: 2.2rem
    height: 2.2rem
    border-radius: 50%
    cursor: pointer
    color: $grey-light

    &:hover
      background: coral

      :global(.Icon)
        color: white
</style>
