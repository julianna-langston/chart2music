import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

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
        input: "dist/entryPoint.d.ts",
        output: [
            {
                file: "dist/index.d.ts",
                format: "es",
                plugins: []
            }
        ],
        plugins: [dts()]
    }
];
