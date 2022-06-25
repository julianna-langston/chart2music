const {defaults} = require("jest-config");

module.exports = {
    moduleFileExtensions: [
        "js",
        "ts"
    ],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: ".+\\.test\\.ts?$",
    collectCoverageFrom: ["src/**/*.{ts,js}"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageThreshold: {
        "./src/utils.ts": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    }
}