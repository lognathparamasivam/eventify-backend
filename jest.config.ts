export default {
  preset: "ts-jest",
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
