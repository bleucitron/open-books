import axios from 'axios';

export function get(...p) {
  return axios
    .get(...p)
    .then(({ data }) => data)
    .catch(e => console.error(e));
}
