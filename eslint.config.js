//// @ts-check

import eslintJsRecommended from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import {
    config as typeScriptEslintCreateConfig,
    configs as typeScriptLintConfigs,
    plugin as typeScriptPlugin
} from 'typescript-eslint'


const config = typeScriptEslintCreateConfig(
    { ignores: [ 'dist', 'node_modules', 'lib' ] },
    {
        extends: [
            ...typeScriptLintConfigs.recommendedTypeChecked,
            eslintJsRecommended.configs.recommended,
            reactPlugin.configs.flat.recommended
        ],
        files: [ '**/*.ts', '**/*.tsx' ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                ecmaFeatures: { 'jsx': true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.worker,
                ...globals.serviceworker,
                ...globals.jest,
                React: true,
                JSX: true
            }
        },
        plugins: { typeScriptPlugin, reactPlugin },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            'no-unused-vars': 0,
            'no-undef': 0,
            'quotes': [ 1, 'single', 'avoid-escape' ],
            'semi': [ 1, 'never' ],
            'comma-spacing': [ 1, {
                'before': false,
                'after': true
            }],
            'keyword-spacing': 1,
            'object-curly-spacing': [ 1, 'always' ],
            'array-callback-return': 1,
            'array-bracket-spacing': [ 1, 'always', {
                'objectsInArrays': false,
                'arraysInArrays': false
            }],
            'arrow-parens': [ 1, 'as-needed' ],
            'arrow-body-style': [ 1, 'as-needed' ],
            'prefer-arrow-callback': 1,
            'prefer-spread': 0,
            'prefer-const': 1,
            'no-cond-assign': 0,
            'no-inner-declarations': 0,
            'no-case-declarations': 0,
            'comma-dangle': 1,
            'eol-last': [ 1, 'never' ],
            'no-trailing-spaces': 1,
            'react/display-name': 0,
            'react/jsx-no-bind': 0,
            'react/no-children-prop': 0,
            'react/prop-types': 0,
            'react/jsx-curly-spacing': [ 1, 'always', {
                'spacing': { 'objectLiterals': 'never' }
            }],
            'react/jsx-first-prop-new-line': [ 1, 'never' ],
            'react/jsx-closing-bracket-location': [ 1, 'after-props' ],
            'react/jsx-tag-spacing': [ 1, {
                'beforeClosing': 'never'
            }],
            'react/jsx-no-useless-fragment': 1,
            'react/jsx-props-no-multi-spaces': 1,
            'react/jsx-fragments': [ 1, 'syntax' ],
            '@typescript-eslint/no-unused-expressions': 0,
            '@typescript-eslint/no-unused-vars': 1,
            '@typescript-eslint/no-non-null-asserted-optional-chain' : 0,
            '@typescript-eslint/ban-ts-comment': 0,
            '@typescript-eslint/no-misused-promises': 0,
            '@typescript-eslint/no-var-requires': 0,
            '@typescript-eslint/explicit-function-return-type': 0,
            '@typescript-eslint/no-use-before-define': 0,
            '@typescript-eslint/no-non-null-assertion': 0,
            '@typescript-eslint/camelcase': 0,
            '@typescript-eslint/member-delimiter-style': 0,
            '@typescript-eslint/no-explicit-any': 0,
            '@typescript-eslint/no-unsafe-member-access': 0,
            '@typescript-eslint/no-unsafe-assignment': 0,
            '@typescript-eslint/restrict-plus-operands': 0,
            '@typescript-eslint/explicit-module-boundary-types': 0,
            '@typescript-eslint/no-unsafe-call': 0,
            '@typescript-eslint/restrict-template-expressions': 0,
            '@typescript-eslint/no-floating-promises': 0,
            '@typescript-eslint/no-unsafe-return': 0,
            '@typescript-eslint/unbound-method': 0,
            '@typescript-eslint/no-unnecessary-type-assertion': 0,
            '@typescript-eslint/no-unsafe-argument': 0,
            '@typescript-eslint/ban-types': 0,
            '@typescript-eslint/no-base-to-string': 0,
            '@typescript-eslint/only-throw-error': 0
        }
    }
)


export default config