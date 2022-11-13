import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import md from 'vite-plugin-markdown';

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');

const pkg = JSON.parse(json);

const markdown = md.default;

const alias = {
  '@api': `${__dirname}/src/api`,
  '@utils': `${__dirname}/src/utils`,
  '@stores': `${__dirname}/src/stores`,
  '@interfaces': `${__dirname}/src/interfaces`,
  '@docs': `${__dirname}/src/docs`,
};

const config: UserConfig = {
  plugins: [markdown({ mode: 'html' }), sveltekit()],
  resolve: { alias },
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
};

export default config;
