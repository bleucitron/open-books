<script>
  import Spinner from 'svelte-spinner';
  export let mainSiretP;
  export let otherSiretsP;
  export let select;
  export let selected;
</script>

<style>
  .selected {
    color: blue;
  }
</style>

<ul class="Sirets">
  <li>
    {#await mainSiretP}
      <Spinner />
    {:then mainSiret}
      <div
        on:click={() => select(mainSiret.id)}
        class={selected === mainSiret.id ? 'selected' : ''}>
        {mainSiret.label}
      </div>
    {/await}
  </li>
  {#await otherSiretsP}
    <Spinner />
  {:then sirets}
    {#each sirets as siret}
      <li>
        <div
          on:click={() => select(siret.id)}
          class={selected === siret.id ? 'selected' : ''}>
          {siret.label}
        </div>
      </li>
    {/each}
  {/await}
</ul>
