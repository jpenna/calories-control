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
      },
    },
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    // eslint broken rules (using typescript)
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "prefer-promise-reject-errors": "off",
    "consistent-return": "off",

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': ["error", { "code": 140 }],
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    "object-shorthand": ["error", "always"],
    'arrow-body-style': 'off',
  },
};
