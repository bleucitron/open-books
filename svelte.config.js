import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import vercel from '@sveltejs/adapter-vercel';
import md from 'vite-plugin-markdown';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

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
    vite: {
      resolve: { alias },
      plugins: [markdown({ mode: 'html' })],
      define: {
        __VERSION__: JSON.stringify(pkg.version),
      },
    },
    adapter: vercel(),
  },
};

export default config;
