// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier'; // We import Prettier directly

export default [
  // 1. Recommended ESLint rules
  js.configs.recommended,

  // 2. Specific configuration for the BACK-END
  {
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node, // Node environment
      },
      sourceType: 'commonjs', // If using "require"
    },
  },

  // 3. Specific configuration for the FRONT-END
  {
    files: ['client/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser, // Browser environment
      },
      sourceType: 'module', // If using "import"
    },
  },

  // 4. Prettier configuration (MUST BE LAST!)
  // Disables ESLint style rules that conflict with Prettier.
  configPrettier,
];
