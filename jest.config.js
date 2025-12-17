// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 1. The Environment
  testEnvironment: 'node',

  // 2. The Translator
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // 3. Cleanup
  testPathIgnorePatterns: ['/node_modules/'],
};
