export default {
  preset: "ts-jest",
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testTimeout: 20000,
  collectCoverage: true,
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  
};
