// server/eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // 1. Base Configuration
  js.configs.recommended,

  {
    // 2. Define the environment
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    // 3. Custom Rule Overrides
    rules: {
      'no-unused-vars': 'warn', // Warns instead of errors
      'no-console': 'off', // Allows console.log
    },

    // 4. Ignore build folders
    ignores: ['node_modules/', 'dist/', 'coverage/'],
  },
];
