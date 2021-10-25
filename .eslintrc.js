module.exports = {
  env: {
    es2021: true,
    commonjs: true,
    node: true,
    browser: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', '@babel'],

  parser: '@babel/eslint-parser',

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },

  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
