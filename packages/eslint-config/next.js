import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
	...baseConfig,
	js.configs.recommended,
	eslintConfigPrettier,
	...tseslint.configs.recommended,
	{
		...pluginReact.configs.flat.recommended,
		languageOptions: {
			...pluginReact.configs.flat.recommended.languageOptions,
			globals: {
				...globals.serviceworker
			}
		}
	},
	{
		plugins: {
			'@next/next': pluginNext
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules
		}
	},
	{
		plugins: {
			'react-hooks': pluginReactHooks,
			'jsx-a11y': jsxA11y,
			import: importPlugin
		},
		settings: {
			react: { version: 'detect' },
			'import/resolver': {
				typescript: true,
				node: true
			}
		},
		rules: {
			...pluginReactHooks.configs.recommended.rules,

			// React
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/no-unescaped-entities': 'warn',

			// Next.js
			'@next/next/no-img-element': 'warn',

			// JSX a11y
			'jsx-a11y/anchor-is-valid': 'off',
			'jsx-a11y/click-events-have-key-events': 'off',
			'jsx-a11y/no-static-element-interactions': 'off',

			// TypeScript
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-duplicate-enum-values': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-require-imports': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-this-alias': [
				'error',
				{
					allowDestructuring: false,
					allowedNames: ['scope', 'self']
				}
			],

			// General
			'no-console': [2, { allow: ['warn', 'error'] }],

			// Import
			'import/no-unresolved': 'error',
			'import/order': [
				'warn',
				{
					groups: [
						['builtin', 'external'],
						'internal',
						['parent', 'sibling', 'index']
					],
					pathGroups: [
						{ pattern: '@workspace/**', group: 'internal' },
						{ pattern: '@/**', group: 'internal' }
					],
					pathGroupsExcludedImportTypes: ['builtin'],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true }
				}
			],
			'import/newline-after-import': 'warn',
			'import/no-duplicates': 'warn',
			'import/no-anonymous-default-export': [
				'error',
				{
					allowArray: false,
					allowArrowFunction: false,
					allowAnonymousClass: false,
					allowAnonymousFunction: false,
					allowCallExpression: true,
					allowNew: false,
					allowLiteral: false,
					allowObject: true
				}
			]
		}
	}
];
