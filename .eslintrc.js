module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    plugins: ['simple-import-sort'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        'react/prop-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-duplicate-imports': 'error',
        'simple-import-sort/imports': 'error',
        '@typescript-eslint/no-array-constructor': 'off',
        '@typescript-eslint/no-explicit-any': [
            'error',
            {
                ignoreRestArgs: true,
            },
        ],
        'no-undef': 'error',
        // will enable rule but allow already used types
        // consider updating these in the future
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    '{}': false,
                    Function: false,
                    object: false,
                },
            },
        ],
        'no-return-await': 'error',
        'default-param-last': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
    },
    ignorePatterns: ['lint-staged.config.js', 'newrelic.js'],
    overrides: [
        {
            files: ['apps/atka-web/**/*.tsx', 'apps/atka-web/**/*.ts'],
            rules: {
                'react/self-closing-comp': [
                    'error',
                    {
                        component: true,
                        html: true,
                    },
                ],
                'no-console': [
                    'error',
                    {
                        allow: ['error', 'debug', 'info'],
                    },
                ], // do not allow console logs on client
                '@typescript-eslint/no-shadow': 'error',
            },
            globals: {
                fetch: true,
                localStorage: true,
            },
        },
    ],
    globals: {
        // browser
        document: true,
        // react
        JSX: true,
    },
    env: {
        browser: true,
        node: true,
    },
};
