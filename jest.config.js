module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: '.tmp/jestCache',
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*/*.d.ts",
    "!src/**/*/Loadable.{js,jsx,ts,tsx}",
    "!src/**/*/messages.ts",
    "!src/**/*/types.ts",
    "!src/index.tsx"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
};
