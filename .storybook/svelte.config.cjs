const preprocess = require('svelte-preprocess');
const autoprefixer = require('autoprefixer');
const md = require('vite-plugin-markdown');

const markdown = md.default;

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
  },
};

module.exports = config;
