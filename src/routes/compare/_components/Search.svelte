<script lang="ts">
  import { goto } from '$app/navigation';

  import { getCities, getSiretsFromInsee } from '@api';
  import type { City } from '@interfaces';

  let value = '';
  let cities: City[] = [];
  let chosenCity: Array<City> = [];
  const siretsFromChosenCities: Array<string> = [];
  $: console.log('pouet', chosenCity);
  $: console.log('cities', cities);

  $: if (chosenCity.length === 2) {
    chosenCity.forEach(async city => {
      const sirets = await getSiretsFromInsee(city.nom, city.code);
      const siretsFromSearchedCities = sirets
        .filter(e => e.etablissementSiege)
        .map(e => e.siret)
        .sort()[0];
      siretsFromChosenCities.push(siretsFromSearchedCities);
      console.log(chosenCity);

      goto(
        `compare-result?sirets=${siretsFromChosenCities[0]},${siretsFromChosenCities[1]}&year=2019&cities=${chosenCity[0].nom},${chosenCity[1].nom}`,
      );
    });
  }

  const handleCityClick = (city: City): void => {
    chosenCity = [...chosenCity, city];
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
