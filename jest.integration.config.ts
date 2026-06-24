import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.integration-spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@modules/(.*)$": "<rootDir>/modules/$1",
    "^@shared/(.*)$": "<rootDir>/shared/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],
  testEnvironment: "node",
  testTimeout: 60000,
};

export default config;
