module.exports = {
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)s$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coveragePathIgnorePatterns: ["node_modules", "<rootDir>/src/parsinator"],
};
