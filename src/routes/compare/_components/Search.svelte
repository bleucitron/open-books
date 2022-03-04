<script lang="ts">
  import { goto } from '$app/navigation';

  import { getCities, getSiretsFromInsee } from '@api';
  import type { City } from '@interfaces';

  let value = '';
  let cities: City[] = [];
  let chosenCity: Array<City> = [];

  $: console.log('pouet', chosenCity);
  $: console.log('cities', cities);

  $: if (chosenCity.length === 2) {
    chosenCity.forEach(city => {
      getSiretsFromInsee(city.nom, city.code).then(r => {
        console.log(r);
        goto(
          `compare-result?sirets=21330063500017,21690123100011&year=2019&cities=${chosenCity[0]},${chosenCity[1]}`,
        );
      });
    });
  }

  const handleCityClick = (city: City): void => {
    chosenCity = [city, ...chosenCity];
  };

  const handleInput = async (e: Event): Promise<void> => {
    const target = e.target as HTMLInputElement;
    value = target.value;
    cities = await getCities(value);
  };
</script>

<input type="text" bind:value on:input={handleInput} />

{#if cities.length > 0}
  {#each cities as city}
    <div on:click={() => handleCityClick(city)}>{city.nom}</div>
  {/each}
{/if}
