const {
  preprocess,
  kit: {
    vite: { resolve },
  },
} = require('./svelte.config.cjs');

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
  ],
  core: {
    builder: 'storybook-builder-vite',
  },
  svelteOptions: {
    preprocess,
  },
  viteFinal: {
    resolve,
  },
};
