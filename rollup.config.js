import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";

// Modified from: https://gist.github.com/rikkit/b636076740dfaa864ce9ee8ae389b81c#file-tsconfig-json

export default [
    {
        input: "src/entryPoint.ts",
        output: [
            {
                file: "dist/index.js",
                name: "c2mChart",
                format: "iife"
            }
        ],
        plugins: [typescript({ tsconfig: "./tsconfig.json" })]
    },
    {
        input: "src/entryPoint_mjs.ts",
        output: [
            {
                file: "dist/index.mjs",
                format: "es"
            }
        ],
        plugins: [typescript({ tsconfig: "./tsconfig.json" })]
    },
    {
        input: "dist/types/entryPoint_mjs.d.ts",
        output: [
            {
                file: "dist/index.d.ts",
                format: "es",
                plugins: []
            }
        ],
        plugins: [dts(), del({ targets: "dist/types", hook: "buildEnd" })]
    }
];
