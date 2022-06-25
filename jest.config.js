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
    coverageProvider: "v8"
}