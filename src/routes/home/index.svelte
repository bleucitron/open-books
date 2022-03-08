<script lang="ts">
  import { goto } from '$app/navigation';
  import { city } from '@stores';
  import { getRandomCities } from '@api/geo';
  import type { City } from '@interfaces';
  import Icon from '$lib/Icon.svelte';

  import Search from './_components/Search.svelte';

  function storeCity(c: City): void {
    $city = c;
    const { nom, code } = $city;

    goto(`/budgets?name=${nom}&insee=${code}`);
  }

  let promise = getRandomCities();

  $: promise.then(cities => console.log(cities));
</script>

<svelte:head>
  <title>Livres ouverts</title>
</svelte:head>

<main>
  <Search on:select={({ detail }) => storeCity(detail)} />

  <div class="examples">
    <p>
      Quelques exemples
      <i>
        <Icon id="refresh-ccw" on:click={() => (promise = getRandomCities())} />
      </i>
    </p>
    {#await promise then randomCities}
      <ul>
        {#each randomCities as city}
          {@const {
            nom,
            code,
            departement: { nom: dpt, code: dptCode },
          } = city}
          <li>
            <a
              href={`/budgets?name=${nom}&insee=${code}`}
              on:click={() => storeCity(city)}
            >
              <div class="city">{nom}</div>
              <div class="dpt">({dpt} - {dptCode})</div>
            </a>
          </li>
        {/each}
      </ul>
    {/await}
  </div>
</main>

<style lang="scss">
  main {
    position: relative;
    flex: 1 0;
    display: flex;
    flex-flow: column;
    align-items: center;

    :global {
      .Search {
        margin-top: 15%;
      }
      .Icon {
        cursor: pointer;
      }
    }

    .examples {
      p {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin: 0;
        font-size: 0.9rem;
        text-align: center;
        color: #bbb;

        i {
          display: flex;
          align-items: center;
          transition: color 0.3s ease-in-out;
          &:hover {
            color: coral;
          }
        }
      }
      display: flex;
      flex-flow: column;
      align-items: center;
      margin-top: 8rem;

      ul {
        display: flex;
        gap: 1.5rem;
        margin: 0;
      }

      li {
        padding: 0.5rem 0.7rem;
        margin: 0.7rem 0;
        text-align: center;
        border-radius: 1em;
        transition: color 0.3s ease-in-out;

        &:hover,
        &:focus {
          opacity: 1;
          color: coral;
        }

        .city {
          font-size: 1.1rem;
        }
        .dpt {
          font-size: 0.8rem;
          opacity: 0.5;
          font-style: italic;
        }
      }
    }
  }
</style>
