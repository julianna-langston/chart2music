/** @type {import('jest').Config} */
module.exports = {
    moduleFileExtensions: ["js", "ts"],
    fakeTimers: {
        enableGlobally: true
    },
    setupFiles: ["<rootDir>/test/_setup.ts"],
    transform: {
        "^.+\\.ts?$": ["ts-jest"]
    },
    testRegex: ".+\\.test\\.ts?$",
    testEnvironment: "jsdom",
    collectCoverageFrom: [
        "src/**/*.{ts,js}",
        // Ignore this file, which calls browser API's that are impossible to test
        "!src/audio/*.ts"
    ],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "babel",
    coverageThreshold: {
        "./src/utils.ts": {
            branches: 95,
            functions: 100,
            lines: 100,
            statements: 100
        },
        "./src/validate.ts": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        },
        "./src/c2mChart.ts": {
            branches: 90,
            functions: 100,
            lines: 90,
            statements: 90
        },
        "./src/dataPoint.ts": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        },
        "./src/keyboardManager.ts": {
            functions: 100,
            lines: 100,
            statements: 100
        },
        "./src/optionDialog.ts": {
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
