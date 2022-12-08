/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testRegex: 'test/test.ts',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './test/tsconfig.json'
      }
    ]
  }
}
