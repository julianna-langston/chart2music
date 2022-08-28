module.exports = {
    moduleFileExtensions: ["js", "ts"],
    globals: {
        "ts-jest": {
            isolatedModules: true
        }
    },
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: ".+\\.test\\.ts?$",
    testEnvironment: "jsdom",
    collectCoverageFrom: ["src/**/*.{ts,js}"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageThreshold: {
        "./src/utils.ts": {
            branches: 100,
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
            functions: 90,
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
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
