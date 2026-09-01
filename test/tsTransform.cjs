const { createTransformer } = require("babel-jest");
const ts = require("typescript");

const babelTransformer = createTransformer({
    plugins: ["@babel/plugin-transform-modules-commonjs"]
});

module.exports = {
    process(sourceText, sourcePath, options) {
        const { outputText } = ts.transpileModule(sourceText, {
            compilerOptions: {
                esModuleInterop: true,
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020
            },
            fileName: sourcePath
        });

        return babelTransformer.process(outputText, sourcePath, options);
    }
};
