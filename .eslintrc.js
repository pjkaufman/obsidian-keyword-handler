module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
    'plugin:jsdoc/recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'jsdoc',
    'unicorn',
  ],
  'rules': {
    'camelcase': 'off',
    'max-len': 'off',
    'no-constant-binary-expression': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'require-jsdoc': 'off',
    'unicorn/template-indent': 'error',
    'no-unused-vars': 'off',
    'valid-jsdoc': 'off',
  },
};
