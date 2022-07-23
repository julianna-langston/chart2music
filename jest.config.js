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
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85
        },
        "./src/dataPoint.ts": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
