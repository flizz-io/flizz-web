import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for Node.js apps (e.g. `apps/api`).
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nodeConfig = [
	...baseConfig,
	js.configs.recommended,
	eslintConfigPrettier,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		plugins: {
			import: importPlugin
		},
		settings: {
			'import/resolver': {
				typescript: true,
				node: true
			}
		},
		rules: {
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

			// General
			'no-console': [2, { allow: ['warn', 'error', 'info'] }],

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
			'import/no-duplicates': 'warn'
		}
	}
];
