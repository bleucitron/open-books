<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import Search from '../routes/home/_components/Search.svelte';
  import { getCities } from '@api';

  let citiesP;
  let previousCities;

  const city = {
    population: 252040,
    departement: {
      code: '33',
      nom: 'Gironde',
    },
    region: {
      code: '75',
      nom: 'Nouvelle-Aquitaine',
    },
    code: '22',
    nom: '',
  };

  function search(text) {
    return fetchCities(text);
  }

  function clear() {
    return fetchCities('');
  }

  function select(c) {
    city.set(c);
  }

  async function fetchCities(text) {
    return await getCities(text).then(cities => {
      const currentCities = cities.slice(0, 5);
      previousCities = currentCities;
      return currentCities;
    });
  }
</script>

<Meta title="Search" component={Search} />

<Story
  name="Basic"
  parameters={{
    layout: 'centered',
  }}
>
  <Search {search} {clear} selected={city} />
</Story>
