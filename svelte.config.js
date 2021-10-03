import { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import vercel from '@sveltejs/adapter-vercel';
import md from 'vite-plugin-markdown';

const markdown = md.default;

const __dirname = dirname(fileURLToPath(import.meta.url));

const alias = {
  '@api': `${__dirname}/src/api`,
  '@utils': `${__dirname}/src/utils`,
  '@stores': `${__dirname}/src/stores`,
  '@interfaces': `${__dirname}/src/interfaces`,
  '@docs': `${__dirname}/src/docs`,
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [autoprefixer],
    },
  }),

  kit: {
    target: '#svelte',
    vite: { resolve: { alias }, plugins: [markdown({ mode: 'html' })] },
    adapter: vercel(),
  },
};

export default config;
