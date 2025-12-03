import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["src/index.ts", "dist/", "**/*.config.js"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:jsdoc/recommended",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["./tsconfig.json", "./tsconfig.test.json"],
        },
    },

    rules: {
        "no-console": "warn",
        "no-alert": "warn",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-for-in-array": "off",
        "no-duplicate-imports": "off",
        "consistent-return": "error",
        eqeqeq: "error",
        "grouped-accessor-pairs": ["error", "getBeforeSet"],
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-script-url": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-implicit-coercion": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        "no-throw-literal": "error",
        "no-unused-expressions": "error",
        "no-undefined": "error",
        "arrow-parens": "error",
        "no-var": "error",
        "prefer-const": "error",

        "jsdoc/require-jsdoc": ["error", {
            require: {
                ArrowFunctionExpression: false,
                ClassDeclaration: true,
                FunctionDeclaration: true,
                FunctionExpression: false,
                MethodDefinition: true,
            },

            contexts: ["TSInterfaceDeclaration", "TSTypeAliasDeclaration", "TSEnumDeclaration"],
            checkGetters: "no-setter",
        }],

        "jsdoc/require-description": ["error", {
            contexts: [
                "ClassDeclaration",
                "ClassProperty",
                "FunctionDeclaration",
                "MethodDefinition",
                "TSEnumDeclaration",
                "TSInterfaceDeclaration",
                "TSModuleDeclaration",
            ],
        }],

        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",

        "jsdoc/require-returns": ["off", {
            checkGetters: false,
        }],
    },
}];