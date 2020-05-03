<script>
  import { makeCSV } from '../../../utils';

  export let data;

  console.log('DATA', data);

  const csvP = makeCSV(data);
</script>

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
      opacity: 0.5;
    }

    &:hover {
      background: #eee;
      i {
        background: white;
        opacity: 1;
      }
    }
  }
</style>

<div class="Csv">
  {#await csvP then csv}
    <a href={csv.url} download={csv.file}>
      <i class="fas fa-file-download" />
    </a>
  {/await}
</div>
