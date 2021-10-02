import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import vercel from '@sveltejs/adapter-vercel';
import md from 'vite-plugin-markdown';

const markdown = md.default;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [autoprefixer],
    },
  }),

  kit: {
    target: '#svelte',
    vite: { plugins: [markdown({ mode: 'html' })] },
    adapter: vercel(),
  },
};

export default config;
