module.exports = {
  env: {
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './server/tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [".js", ".ts"],
      }
    },
  },
  rules: {
    // eslint broken rules (using typescript)
    "import/no-unresolved": "off",
    "consistent-return": "off",
    "func-names": "off",

    // Custom
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "no-console": "off",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "arrow-body-style": "off",
  }
};
