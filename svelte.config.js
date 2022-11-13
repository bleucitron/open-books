import { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import vercel from '@sveltejs/adapter-vercel';

export const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    sass: {
      prependData: `@import '${__dirname}/src/styles/index'`,
      renderSync: true,
    },
    postcss: {
      plugins: [autoprefixer],
    },
  }),

  kit: {
    adapter: vercel(),
  },
};

export default config;
