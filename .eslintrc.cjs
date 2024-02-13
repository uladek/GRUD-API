
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
  rules: {
      "max-len": ["error", { "code": 90 }],
      'max-lines-per-function': ['error', 40],
    },
};
