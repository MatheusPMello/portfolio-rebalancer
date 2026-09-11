// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 1. The Environment
  testEnvironment: 'node',

  // 2. The Translator
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'server/tsconfig.json',
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },

  // 3. Cleanup
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/client/'],

  // 4. Resolve relative ESM imports (.js -> .ts)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
