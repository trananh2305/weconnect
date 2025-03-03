export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
    },
  };