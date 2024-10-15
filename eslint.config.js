import js from '@eslint/js';
import gitignore from 'eslint-config-flat-gitignore';
import globals from 'globals';
import eslintPluginCypress from 'eslint-plugin-cypress/flat';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default [
    gitignore(),
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    eslintPluginCypress.configs.globals,
    eslintPluginCypress.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
    },
    eslintConfigPrettier,
];
