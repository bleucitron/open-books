<script lang="ts" context="module">
  import { get } from 'svelte/store';
  import type { Load } from '@sveltejs/kit';
  import { getCity } from '@api';
  import { extractSirens } from '@api/utils/siren';
  import { city } from '@stores';
  import type { City, Etablissement } from '@interfaces';
  import { makeBudgetUrl } from '@utils';
  import { extractSiren, formatValue } from '@utils/misc';
  import FavoriteToggle from '$lib/FavoriteToggle.svelte';
  import FavoriteMenu from '$lib/FavoriteMenu.svelte';

  const defaultYear = new Date().getFullYear() - 2;

  export const load: Load = async ({ url: { searchParams }, fetch }) => {
    const insee = searchParams.get('insee');
    const y = searchParams.get('year');
    const sirenString = searchParams.get('sirens');
    let siret = searchParams.get('siret');

    if (!insee && !siret && !sirenString) {
      return {
        redirect: '/',
        status: 302,
      };
    }

    const year = parseInt(y) || defaultYear;

    let $city = insee && get(city);
    let sirens = sirenString?.split(',');

    if (insee) {
      if (!$city || $city.code !== insee) {
        $city = await getCity(insee, fetch);
      }

      if (!siret || !sirens) {
        const siretsFromInsee = (await fetch(
          `sirene/siretsFromInsee/${insee}`,
        ).then(r => r.json())) as Etablissement[];

        if (!siretsFromInsee) {
          throw new Error(
            `Nous ne trouvons pas d'informations SIRENE sur la commune ${$city.nom} (code INSEE ${$city.code})`,
          );
        }

        const mainSirets = siretsFromInsee.filter(e => e.etablissementSiege);
        sirens = extractSirens(mainSirets);

        const sirets = mainSirets.map(e => e.siret).sort();

        siret = sirets[0];

        return {
          redirect: makeBudgetUrl({
            insee,
            siret,
            sirens,
            year,
          }),
          status: 302,
        };
      }
    } else if (!sirens) {
      sirens = [extractSiren(siret)];
    }

    return {
      props: {
        sirens,
        currentSiret: siret,
        currentCity: $city,
        insee,
      },
      stuff: { city: $city }, // needed to communicate with index while server-side
    };
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Icon from '$lib/Icon.svelte';
  import Search from '$lib/Search.svelte';
  import HistoryMenu from '$lib/HistoryMenu.svelte';
  import { history } from '@stores';
  import { redirectToBudget } from '../_utils';

  export let sirens: string[];
  export let currentSiret: string;
  export let currentCity: City;
  export let insee: string;

  $: _city = $city ?? currentCity;
  $: nom = _city.nom ?? currentSiret;

  $: if ($page) {
    history.addItem({
      name: nom,
      insee,
      sirens,
    });
  }

  onMount(() => {
    // for direct access to budget page
    $city = currentCity;
  });
</script>

<svelte:head>
  {#if _city}
    {@const { nom, departement } = _city}
    <title>{`Budgets pour ${nom} (${departement.code})`}</title>
  {:else}
    <title>{`Budgets pour ${nom}`}</title>
  {/if}
</svelte:head>

<header>
  <div>
    <a class="home" href="/">
      <Icon id="book-open" />
    </a>
    <div class="info-container">
      <div class="titles">
        <FavoriteToggle name={nom} {insee} {sirens} />
        <h1>{nom}</h1>
        {#if _city}
          {@const { nom, population, departement } = _city}
          <div class="info">
            <span>{formatValue(population)} habitants</span>
            <span>
              ({nom} - {departement.code})
            </span>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <div class="actions">
    <Search on:select={({ detail }) => redirectToBudget(detail)} />
    <HistoryMenu />
    <FavoriteMenu />
  </div>
</header>

<slot />

<style lang="sass">
  header
    position: relative
    display: flex
    justify-content: space-between
    padding: 0 1rem
    height: $headerHeight
    background: $grey-darkest
    color: $grey-dark

    > div
      display: flex
      align-items: center

      &:first-child
        flex: 1

      :global
        .Search
          width: 30rem
          height: 100%
          font-size: 1rem

          :global(.Icon)
            font-size: 1rem
            margin: 0.8rem

        .search-input
          font-size: 1rem
          height: 100%

          &::placeholder
            color: $grey-dark

          &:focus::placeholder
            color: $grey

        .searchbar
          height: 100%
          background: $grey-darker
          border-radius: 0
          font-size: 1.1rem

          &:focus-within
            background: $grey-dark


        .Suggestion
          font-size: 1em

    .actions
      gap: 1rem

    .info-container
      display: flex
      flex-direction: column

    .home
      display: flex
      align-items: center
      height: 100%
      font-size: 1.5rem
      margin-right: 1.2rem
      transition: color 0.3s ease-in-out

      &:hover
        color: coral

    .titles
      display: flex
      align-items: baseline
      gap: 0.5rem

    h1
      font-size: 2rem
      color: $grey-lightest

    .info
      margin: 0
      display: flex
      align-items: flex-end

      span:first-child
        margin-right: 3px

      span:last-child
        margin-left: 3px
</style>
