module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    gtag: 'readonly',
    __VERSION__: 'readonly',
    NodeJS: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'lastest',
    sourceType: 'module',
  },
  ignorePatterns: ['*.cjs'],
  plugins: ['svelte3', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    'prefer-arrow-callback': 'error',
    'id-length': ['error', { min: 1, max: 40 }],
    'no-redeclare': ['error', { builtinGlobals: false }],
    'no-global-assign': ['error', { exceptions: ['open'] }],
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
      'off', // should be handled by explicit-function-return-type
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
    '@typescript-eslint/no-non-null-assertion': 'off',
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
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
    'svelte3/ignore-styles': () => {
      return true;
    },
  },
};
