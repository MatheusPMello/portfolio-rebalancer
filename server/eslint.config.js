// server/eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
  // 1. Global Ignores (must be at the top of the array)
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', 'eslint.config.js'],
  },

  // 2. Base Configuration for JavaScript
  js.configs.recommended,

  // 3. Recommended rules for TypeScript (scoped to src/**/*.ts)
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['src/**/*.ts'],
  })),

  // 4. Custom Configuration for TypeScript Source Code
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    plugins: {
      jsdoc,
    },

    // 5. Rules configuration
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'off',
    },
  },
];
