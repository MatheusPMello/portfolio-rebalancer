// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';

export default [
  // 1. Recommended ESLint rules
  js.configs.recommended,

  // 2. Specific configuration for the BACK-END
  {
    files: ['server/**/*.js', 'jest.config.js'],
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

  // 4. Jest Configuration (Targeting Test Files Only)
  {
    files: ['**/*.test.js'],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
      // "strict": "off"
    },
  },

  // 4. Prettier configuration
  configPrettier,
];
