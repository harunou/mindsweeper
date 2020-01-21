/**
 * @typedef { import("prettier").Options } PrettierConfig
 * @typedef { Array<{files: string | string[], options: PrettierConfig}> } PrettierOverrides
 * @type { PrettierConfig & { overrides?: PrettierOverrides } }
 */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    printWidth: 72,
    singleQuote: true,
    endOfLine: 'lf',
    quoteProps: 'as-needed',
    jsxSingleQuote: true,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
                printWidth: 120,
            },
        },
        {
            files: '*.html',
            options: {
                tabWidth: 2,
                printWidth: 120,
            },
        },
    ],
};

module.exports = config;
