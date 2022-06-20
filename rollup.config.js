import typescript from "@rollup/plugin-typescript";


/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: "src/index.ts",
    output: {
        dir: "dist",
        name: "Sonify",
        format: "iife",
        sourcemap: false
    },
    plugins: [typescript()]
}

export default config;