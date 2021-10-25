module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
