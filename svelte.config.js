import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [autoprefixer],
    },
  }),

  kit: {
    target: '#svelte',
    adapter: vercel(),
  },
};

export default config;
