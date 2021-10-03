module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {},
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'lastest',
    sourceType: 'module',
  },
  plugins: ['svelte3', 'prettier', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'id-length': ['error', { min: 1, max: 40 }],
    /**
     * This crashes, see: https://github.com/eslint/eslint/issues/14760.
     * The equivalent ts rule works fine though.
     */
    // 'no-unused-vars': [
    //     'error',
    //     {
    //         args: 'after-used',
    //         ignoreRestSiblings: true,
    //     },
    // ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      { allowArgumentsExplicitlyTypedAsAny: true },
    ],
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true,
        ignoreProperties: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'unused-export-let': 'error',
      },
    },
    {
      files: ['**/*.ts'],
      extends: ['plugin:prettier/recommended'],
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
    'svelte3/ignore-styles': () => {
      return true;
    },
  },
};
