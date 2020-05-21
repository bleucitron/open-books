<script>
  import classnames from 'classnames';
  import Spinner from './Spinner.svelte';

  export let labels;
  export let select;
  export let selected;

  const defaultLabel = 'commune';

  $: sirens = [...new Set(labels.map(({ siren }) => siren))];
</script>

<style lang="scss">
  .Labels {
    display: flex;
    flex-flow: column;
    width: 15rem;
    margin: 0;
  }

  li.siren {
    border-top: 1px solid rgba(white, 0.1);
    margin-bottom: 0.5rem;

    &:first-child {
      border: none;
    }
  }

  .siret {
    text-transform: capitalize;
    font-size: 1rem;
    text-align: right;
    padding: 0.25rem 0;

    > div {
      opacity: 0.2;
      cursor: pointer;

      &:hover {
        opacity: 0.7;

        .info {
          opacity: 0.4;
        }

        .siren {
          opacity: 1;
        }
      }
    }

    &.selected > div {
      opacity: 1;

      .info {
        opacity: 0.4;
      }

      .siren {
        opacity: 1;
      }
    }

    .info {
      opacity: 0.6;
      font-size: 0.7rem;
    }

    &:not(.main) .siren {
      opacity: 0;
    }
  }
</style>

<ul class="Labels">
  {#if labels.length === 0}
    <Spinner color={'#999'} />
  {:else}
    {#each sirens as siren}
      <li class="siren">
        <ul>
          {#each labels.filter(l => l.siren === siren) as { siret, siren, etabl, label, main }, i}
            <li
              class={classnames({
                siret: true,
                selected: selected === siret,
                main: i === 0,
              })}>
              <div on:click={() => select(siret)}>
                <div class="info">
                  <span class="siren">{siren}</span>
                  <span class="etabl">{etabl}</span>
                </div>
                <div class="label">{label || defaultLabel}</div>
              </div>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  {/if}
</ul>
