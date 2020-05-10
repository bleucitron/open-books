<script>
  import classnames from 'classnames';
  import Spinner from './Spinner.svelte';

  export let labelsFromId;
  export let select;
  export let selected;

  const defaultLabel = 'commune';

  $: sirens = labelsFromId
    ? [...new Set(Object.keys(labelsFromId).map(s => s.substring(0, 9)))]
    : [];

  $: labels = sirens
    .map(siren =>
      Object.values(labelsFromId)
        .filter(l => l.siret.substring(0, 9) === siren)
        .map((l, i) => {
          const { siret } = l;
          const etabl = siret.substring(9);

          return {
            ...l,
            siren,
            main: i === 0,
            etabl,
          };
        }),
    )
    .flat()
    .sort((l1, l2) => l1.siret - l2.siret);
</script>

<style lang="scss">
  .Sirets {
    display: flex;
    flex-flow: column;
    width: 15rem;
    margin: 0;
  }

  li {
    cursor: pointer;
    text-transform: capitalize;
    font-size: 1rem;
    text-align: right;
    padding: 0.25rem 0;

    > div {
      opacity: 0.2;
    }

    .info {
      opacity: 0.6;
      font-size: 0.7rem;
    }

    &.main {
      border-top: 1px solid rgba(white, 0.2);
      padding-top: 1rem;
    }

    &:first-child {
      border: none;
      padding-top: 0;
    }

    &:not(.main) .siren {
      opacity: 0;
    }

    &:hover {
      > div {
        opacity: 0.7;
      }

      .info {
        opacity: 0.4;
      }

      .siren {
        opacity: 1;
      }
    }

    &.selected {
      > div {
        opacity: 1;
      }

      .info {
        opacity: 0.4;
      }

      .siren {
        opacity: 1;
      }
    }
  }
</style>

<ul class="Sirets">
  {#if !labelsFromId}
    <Spinner color={'#999'} />
  {:else}
    {#each labels as { siret, siren, etabl, label, main }}
      <li
        on:click={() => select(siret)}
        class={classnames({ selected: selected === siret, main })}>
        <div>
          <div class="info">
            <span class="siren">{siren}</span>
            <span class="siret">{etabl}</span>
          </div>
          <div class="label">{label || defaultLabel}</div>
        </div>
      </li>
    {/each}
  {/if}
</ul>
