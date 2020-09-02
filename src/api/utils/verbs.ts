import axios from 'axios';

export function get(url: string, ...p: any): Promise<any> {
  return axios.get(url, ...p).then(({ data }) => data);
}
