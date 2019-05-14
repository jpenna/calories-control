module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: [".js", ".ts"],
      }
    },
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './server/tsconfig.json',
  },
  rules: {
    // eslint broken rules (using typescript)
    // "import/no-unresolved": "off",
    "import/extensions": "off",

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
