import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@modules/(.*)$": "<rootDir>/modules/$1",
    "^@shared/(.*)$": "<rootDir>/shared/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],
  collectCoverageFrom: ["**/*.(t|j)s", "!**/*.spec.ts", "!**/node_modules/**"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};

export default config;
