// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import configPrettier from "eslint-config-prettier"; // Importamos o Prettier diretamente

export default [
  // 1. Regras recomendadas do ESLint
  js.configs.recommended,

  // 2. Configuração específica para o BACK-END
  {
    files: ["server/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node, // Ambiente Node
      },
      sourceType: "commonjs", // Se usar "require"
    },
  },

  // 3. Configuração específica para o FRONT-END
  {
    files: ["frontend/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser, // Ambiente Browser
      },
      sourceType: "module", // Se usar "import"
    },
  },

  // 4. Configuração do Prettier (DEVE SER A ÚLTIMA!)
  // Desativa regras de estilo do ESLint que conflitam com o Prettier.
  configPrettier,
];