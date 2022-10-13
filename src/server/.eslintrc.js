module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'no-console': 'off',
    'max-len': ['error', { ignoreComments: true, code: 150 }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/extensions': 'off',
  },
};
