import js from '@eslint/js';
import gitignore from 'eslint-config-flat-gitignore';
import globals from 'globals';
import eslintPluginCypress from 'eslint-plugin-cypress/flat';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';

export default [
    gitignore(),
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
    },
    js.configs.recommended,
    eslintPluginCypress.configs.globals,
    eslintPluginCypress.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    eslintConfigPrettier,
];
