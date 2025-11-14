// eslint.config.js (ESM, ESLint v9 flat config)
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNamingConvention from 'eslint-plugin-react-naming-convention';
import reactRefresh from 'eslint-plugin-react-refresh';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import testingLibrary from 'eslint-plugin-testing-library';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	// Top-level ignores (applies to all files)
	// Note: Config files (*.config.ts, *.config.js) are NOT ignored so they can use the override below
	{
		ignores: [
			'dist',
			'build',
			'node_modules',
			'coverage',
			'.next',
			'.storybook',
			'storybook-static',
			'tsconfig*.json',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'**/*.md',
			'**/*.mdc',
			'.vite',
			'.vitest',
			'*.min.js',
			'*.bundle.js',
			'e2e/**/*',
			'playwright-report/**/*',
			'test-results/**/*',
		],
	},
	js.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				// Performance optimization: only parse when needed
				projectService: {
					allowDefaultProject: ['*.js', '*.mjs', '*.cjs'],
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2023,
				// Google Maps API global (from @types/google.maps)
				google: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			react,
			'react-hooks': reactHooks,
			'react-naming-convention': reactNamingConvention,
			'jsx-a11y': jsxA11y,
			'react-refresh': reactRefresh,
			boundaries,
			import: importPlugin,
			'simple-import-sort': simpleImportSort,
			'unused-imports': unusedImports,
			unicorn,
			sonarjs,
			security,
		},
		settings: {
			react: { version: 'detect' },
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: [
						'./tsconfig.base.json',
						'./tsconfig.app.json',
						'./tsconfig.node.json',
						'./tsconfig.vitest.json',
					],
					noWarnOnMultipleProjects: true,
				},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
					moduleDirectory: ['node_modules', 'src'],
				},
				// Note: Path aliases are automatically resolved from tsconfig files
				// via the typescript resolver above (reads from tsconfig.base.json paths)
			},
			'boundaries/elements': [
				{ type: 'app', pattern: 'src/app/*' },
				{ type: 'core', pattern: 'src/core/*' },
				{ type: 'domains', pattern: 'src/domains/*' },
				{ type: 'infra', pattern: 'src/infrastructure/*' },
				{ type: 'shared', pattern: 'src/shared/*' },
			],
		},
		rules: {
			// React rules
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			'react/display-name': 'warn',
			'react/jsx-key': 'error',
			'react/jsx-no-target-blank': 'error',
			'react/prop-types': 'off', // TypeScript handles this
			'react/jsx-no-duplicate-props': 'error',
			'react/jsx-no-undef': 'error',
			'react/jsx-uses-vars': 'error',
			'react/no-children-prop': 'error',
			'react/no-danger-with-children': 'error',
			'react/no-deprecated': 'error',
			'react/no-direct-mutation-state': 'error',
			'react/no-find-dom-node': 'error',
			'react/no-is-mounted': 'error',
			'react/no-render-return-value': 'error',
			'react/no-string-refs': 'error',
			'react/no-unescaped-entities': 'error',
			'react/no-unknown-property': 'error',
			'react/no-unsafe': 'error',
			'react/require-render-return': 'error',
			'react/jsx-no-leaked-render': 'error',
			'react/jsx-no-useless-fragment': 'error',
			'react/no-array-index-key': 'warn',
			'react/self-closing-comp': 'error',
			'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
			'react/jsx-fragments': ['error', 'syntax'],
			'react/no-unstable-nested-components': 'error',
			'react/jsx-newline': 'off', // Handled by Prettier

			// React Hooks
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			// Enforce useState destructuring into value + setter pair (SonarJS S6754 equivalent)
			'react-naming-convention/use-state': 'warn',

			// TypeScript rules
			// Disable @typescript-eslint/no-unused-vars in favor of unused-imports plugin
			// which provides better unused import detection
			'@typescript-eslint/no-unused-vars': 'off',
			// Disable base no-unused-vars in favor of unused-imports/no-unused-vars
			// which provides better unused import detection and pattern matching
			'no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' },
			],
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-unnecessary-condition': [
				'warn',
				{
					// Allow SSR runtime checks on globalThis.window/document which may be undefined in SSR
					allowConstantLoopConditions: true,
				},
			],
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false,
				},
			],
			'@typescript-eslint/prefer-nullish-coalescing': 'warn',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/ban-ts-comment': [
				'warn',
				{
					'ts-expect-error': 'allow-with-description',
					'ts-ignore': true,
					'ts-nocheck': true,
					'ts-check': false,
				},
			],
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/no-confusing-void-expression': [
				'error',
				{
					ignoreArrowShorthand: true,
				},
			],
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/prefer-return-this-type': 'warn',
			'@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
			'@typescript-eslint/prefer-for-of': 'error',
			// Warn when deprecated TypeScript APIs are used (SonarQube S1874 equivalent)
			'@typescript-eslint/no-deprecated': 'warn',

			// Boundaries rules
			// Enforce architecture boundaries: app → domains → core; infrastructure as adapters
			'boundaries/element-types': [
				'error',
				{
					default: 'disallow',
					rules: [
						// app: may import core, domains, shared, infrastructure
						{ from: 'app', allow: ['app', 'domains', 'shared', 'core', 'infra'] },
						// domains: may import core, shared (NOT app, infra, or other domains)
						{ from: 'domains', allow: ['shared', 'core'] },
						// core: framework-agnostic, only standard libs (no app, domains, infra, shared)
						{ from: 'core', allow: ['core'] },
						// shared: may import core (never app or infrastructure)
						{ from: 'shared', allow: ['shared', 'core'] },
						// infra: may import core types/interfaces (avoid importing domains)
						{ from: 'infra', allow: ['infra', 'core'] },
					],
				},
			],

			// Import restrictions - prefer path aliases over relative imports
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['../*', '../../*', '../../../*', '../../../../*'],
							message:
								'Use path aliases (@app, @core, @domains, @infra, @shared, @styles, @tests, @src-types) instead of relative imports',
						},
					],
				},
			],

			// Import validation
			// Note: import/no-cycle is disabled due to performance issues on large codebases
			// It requires building a full dependency graph which can be extremely slow
			'import/no-unresolved': 'error',
			'import/no-cycle': 'error', // Disabled for performance - use 'import/no-cycle' only when needed
			'import/no-self-import': 'error',
			'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
			'import/no-duplicates': 'error',
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-absolute-path': 'error',
			'import/no-dynamic-require': 'error',
			'import/no-relative-packages': 'error',
			'import/no-deprecated': 'warn',
			'import/no-empty-named-blocks': 'error',

			// Unused imports
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					// Match any variable starting with underscore (e.g., _error, _value, _param, etc.)
					varsIgnorePattern: '^_',
					args: 'after-used',
					// Match any function parameter starting with underscore
					argsIgnorePattern: '^_',
					// Match any caught error variable starting with underscore
					caughtErrorsIgnorePattern: '^_',
					// Match any destructured array element starting with underscore
					// Also allow setter variables from useState that may not be used
					destructuredArrayIgnorePattern: '^_|^set[A-Z]',
				},
			],

			// Import sorting
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',

			// Accessibility
			...jsxA11y.configs.recommended.rules,
			'jsx-a11y/click-events-have-key-events': 'warn',
			'jsx-a11y/no-static-element-interactions': 'warn',
			'jsx-a11y/anchor-is-valid': 'warn',
			'jsx-a11y/alt-text': 'error',

			// Essential JS rules
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'no-alert': 'error',
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			curly: ['error', 'all'],
			// Prefer globalThis.window over window (SonarJS S7764 equivalent)
			// Flags window.property access but allows typeof window for SSR checks (more idiomatic)
			'no-restricted-syntax': [
				'warn',
				{
					selector: 'MemberExpression[object.name="window"][property]',
					message: 'Use globalThis.window instead of window.',
				},
				{
					selector:
						'MemberExpression[object.type="MetaProperty"][object.meta.name="import"][object.property.name="meta"][property.name="env"]',
					message:
						'Do not access import.meta.env directly. Import from @core/config/env.client instead. See: .cursor/rules/config/config.mdc',
				},
			],
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-wrappers': 'error',
			'no-implicit-globals': 'error',
			'no-magic-numbers': [
				'warn',
				{
					ignore: [
						-1, // Common for "not found" patterns
						0, // Zero for comparisons
						1, // Common increment/decrement
						2, // Common for pair/duo patterns
						100, // Percentage
						1000, // Common multiplier (KB conversion)
					],
					ignoreArrayIndexes: true,
					ignoreDefaultValues: true,
					ignoreNumericLiteralTypes: true,
					ignoreReadonlyClassProperties: true,
					ignoreTypeIndexes: true,
					detectObjects: false, // Allow object keys/values with numbers
					enforceConst: true, // Prefer named constants
				},
			],
			'no-shadow': 'off', // Use TypeScript version instead
			'@typescript-eslint/no-shadow': 'error',
			'object-shorthand': 'error',
			'prefer-arrow-callback': 'error',
			'no-duplicate-imports': 'error',
			'no-useless-rename': 'error',
			'no-useless-concat': 'error',
			'no-useless-computed-key': 'error',
			'no-useless-constructor': 'error',
			'no-void': 'error',
			'prefer-promise-reject-errors': 'error',
			'no-throw-literal': 'error',
			'no-return-await': 'error',
			'no-unused-expressions': 'off', // Use TypeScript version instead
			'@typescript-eslint/no-unused-expressions': 'error',
			'no-unused-labels': 'error',
			'no-unreachable': 'error',
			'no-unreachable-loop': 'error',
			'no-unsafe-finally': 'error',
			'no-unsafe-negation': 'error',
			'no-useless-catch': 'error',
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'rest-spread-spacing': 'error',
			'template-curly-spacing': 'error',
			'yield-star-spacing': 'error',
			'prefer-object-spread': 'error',
			'prefer-object-has-own': 'warn', // Use Object.hasOwn() instead of Object.prototype.hasOwnProperty.call() (SonarJS S6653 equivalent)
			'prefer-exponentiation-operator': 'error',
			'prefer-numeric-literals': 'error',
			'prefer-regex-literals': 'error',
			'no-useless-escape': 'error',
			'no-array-constructor': 'error',
			'no-new-object': 'error',
			'no-new-symbol': 'error',
			'no-octal-escape': 'error',
			'no-proto': 'error',
			'no-iterator': 'error',
			'no-promise-executor-return': 'error',
			'no-unsafe-optional-chaining': 'error',
			'no-useless-backreference': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-template': 'error',
			'prefer-destructuring': [
				'error',
				{
					array: true,
					object: true,
				},
				{
					enforceForRenamedProperties: false,
				},
			],

			// Essential error prevention
			'no-cond-assign': 'error',
			'no-constant-condition': 'error',
			'no-dupe-args': 'error',
			'no-dupe-keys': 'error',
			'no-duplicate-case': 'error',
			'no-empty': 'error',
			'no-empty-character-class': 'error',
			'no-ex-assign': 'error',
			'no-extra-boolean-cast': 'error',
			'no-extra-semi': 'error',
			'no-func-assign': 'error',
			'no-invalid-regexp': 'error',
			'no-irregular-whitespace': 'error',
			'no-regex-spaces': 'error',
			'no-sparse-arrays': 'error',
			'no-unexpected-multiline': 'error',
			'use-isnan': 'error',
			'valid-typeof': 'error',
			'no-loop-func': 'error',
			'no-param-reassign': ['warn', { props: false }],
			'no-return-assign': 'error',
			'no-self-compare': 'error',
			'no-sequences': 'error',
			'no-unmodified-loop-condition': 'error',

			// Unicorn rules (essential best practices)
			'unicorn/better-regex': 'error',
			'unicorn/catch-error-name': 'error',
			'unicorn/consistent-destructuring': 'error',
			'unicorn/error-message': 'error',
			'unicorn/escape-case': 'error',
			'unicorn/explicit-length-check': 'error',
			'unicorn/new-for-builtins': 'error',
			'unicorn/no-abusive-eslint-disable': 'error',
			'unicorn/no-array-callback-reference': 'error',
			'unicorn/no-array-for-each': 'error',
			'unicorn/no-array-method-this-argument': 'error',
			'unicorn/no-array-push-push': 'error',
			'unicorn/no-console-spaces': 'error',
			'unicorn/no-empty-file': 'error',
			'unicorn/no-for-loop': 'error',
			'unicorn/no-instanceof-array': 'error',
			'unicorn/no-invalid-remove-event-listener': 'error',
			'unicorn/no-lonely-if': 'error',
			'unicorn/no-new-array': 'error',
			'unicorn/no-new-buffer': 'error',
			'unicorn/no-object-as-default-parameter': 'error',
			'unicorn/no-process-exit': 'error',
			'unicorn/no-thenable': 'error',
			'unicorn/no-this-assignment': 'error',
			'unicorn/no-typeof-undefined': 'error',
			'unicorn/no-unnecessary-await': 'error',
			'unicorn/no-unused-properties': 'error',
			'unicorn/no-useless-fallback-in-spread': 'error',
			'unicorn/no-useless-length-check': 'error',
			'unicorn/no-useless-promise-resolve-reject': 'error',
			'unicorn/no-useless-spread': 'error',
			'unicorn/prefer-add-event-listener': 'error',
			'unicorn/prefer-array-find': 'error',
			'unicorn/prefer-array-flat': 'error',
			'unicorn/prefer-array-flat-map': 'error',
			'unicorn/prefer-array-index-of': 'error',
			'unicorn/prefer-array-some': 'error',
			'unicorn/prefer-at': 'error',
			'unicorn/prefer-code-point': 'error',
			'unicorn/prefer-date-now': 'error',
			'unicorn/prefer-default-parameters': 'error',
			'unicorn/prefer-dom-node-append': 'error',
			'unicorn/prefer-dom-node-dataset': 'error',
			'unicorn/prefer-dom-node-remove': 'error',
			'unicorn/prefer-dom-node-text-content': 'error',
			'unicorn/prefer-export-from': 'error',
			'unicorn/prefer-includes': 'error',
			'unicorn/prefer-keyboard-event-key': 'error',
			'unicorn/prefer-modern-dom-apis': 'error',
			'unicorn/prefer-native-coercion-functions': 'error',
			'unicorn/prefer-negative-index': 'error',
			'unicorn/prefer-node-protocol': 'error',
			'unicorn/prefer-number-properties': 'error',
			'unicorn/prefer-object-from-entries': 'error',
			'unicorn/prefer-optional-catch-binding': 'error',
			'unicorn/prefer-prototype-methods': 'error',
			'unicorn/prefer-query-selector': 'error',
			'unicorn/prefer-regexp-test': 'error',
			'unicorn/prefer-set-has': 'error',
			'unicorn/prefer-string-replace-all': 'error',
			'unicorn/prefer-string-slice': 'error',
			'unicorn/prefer-string-starts-ends-with': 'error',
			'unicorn/prefer-string-trim-start-end': 'error',
			'unicorn/prefer-switch': 'error',
			'unicorn/prefer-ternary': 'error',
			'unicorn/prefer-type-error': 'error',
			'unicorn/relative-url-style': 'error',
			'unicorn/require-array-join-separator': 'error',
			'unicorn/require-number-to-fixed-digits-argument': 'error',
			'unicorn/switch-case-braces': 'error',
			'unicorn/throw-new-error': 'error',

			// Complexity rules - General (default): 250 file, 40 function, 3 params, 10 complexity, 4 depth, 20 statements, 3 nested callbacks
			'max-lines': [
				'error',
				{
					max: 250,
					skipBlankLines: true,
					skipComments: true,
				},
			],
			'max-lines-per-function': [
				'error',
				{
					max: 40,
					skipBlankLines: true,
					skipComments: true,
				},
			],
			'max-params': ['error', 3],
			complexity: ['error', 10],
			'max-depth': ['error', 4],
			'max-statements': ['error', 20],
			'max-nested-callbacks': ['error', 3],
			'max-statements-per-line': ['warn', { max: 1 }],
			'max-classes-per-file': ['warn', 1],

			// SonarJS rules for code quality
			'sonarjs/cognitive-complexity': ['warn', 15],
			'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
			'sonarjs/no-duplicated-branches': 'warn',
			'sonarjs/no-identical-conditions': 'warn',
			'sonarjs/no-identical-expressions': 'warn',
			'sonarjs/no-redundant-boolean': 'warn',
			'sonarjs/no-redundant-jump': 'warn',
			'sonarjs/prefer-immediate-return': 'warn',
			'sonarjs/prefer-read-only-props': 'warn', // Mark component props as readonly (SonarQube S6759)
			'sonarjs/prefer-single-boolean-return': 'warn',

			// Security rules (essential for production)
			// Note: Some Node-specific rules disabled for browser-focused React app
			'security/detect-eval-with-expression': 'error',
			'security/detect-non-literal-regexp': 'warn',
			'security/detect-possible-timing-attacks': 'warn',
			'security/detect-unsafe-regex': 'error',

			// Performance and best practices
			'no-implicit-coercion': 'error',
			// Note: 'no-lonely-if' is handled by 'unicorn/no-lonely-if' rule above
			'no-use-before-define': [
				'error',
				{
					functions: false,
					classes: true,
					variables: true,
				},
			],
		},
	},
	// Tests override (Vitest globals)
	// Tests: 500 file, 60 function, 5 params, 20 complexity, 5 depth, 40 statements, 4 nested callbacks - warn level
	{
		files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				project: ['./tsconfig.vitest.json'],
				projectService: false,
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.vitest,
			},
		},
		plugins: {
			'testing-library': testingLibrary,
			'react-refresh': reactRefresh,
		},
		rules: {
			...testingLibrary.configs.react.rules,
			'testing-library/no-manual-cleanup': 'error',
			// Disable false positive: testing-library/no-debugging-utils flags legitimate method calls like adapter.debug()
			'testing-library/no-debugging-utils': 'off',
			// Disable react-refresh rules in tests (test utilities don't use Fast Refresh)
			'react-refresh/only-export-components': 'off',
			// Relax some rules in tests
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'off', // Tests often don't need to await all promises
			'@typescript-eslint/no-unnecessary-condition': 'off', // Tests often use defensive optional chaining/nullish coalescing
			'no-magic-numbers': 'off', // Tests often use magic numbers for test data
			// Disable security rules in tests (mocking patterns may trigger false positives)
			'security/detect-non-literal-regexp': 'off',
			'max-lines': [
				'warn',
				{
					max: 500,
					skipBlankLines: true,
					skipComments: true,
				},
			],
			'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
			'max-params': ['warn', 5],
			complexity: ['warn', 20],
			'max-depth': ['warn', 5],
			'max-statements': ['warn', 40],
			'max-nested-callbacks': ['warn', 4],
		},
	},
	// Config files override - TypeScript config files
	// Config files: all off - no restrictions
	// Note: Excludes src/**/*.config.ts files which should use the app TypeScript config
	{
		files: [
			'vite.config.ts',
			'vitest.config.ts',
			'tailwind.config.ts',
			'playwright.config.ts',
			'**/*.config.ts',
		],
		ignores: ['src/**/*.config.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.node.json',
				projectService: false,
			},
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-console': 'off',
			'unicorn/prefer-module': 'off',
			'max-lines': 'off',
			'no-magic-numbers': 'off', // Config files often use magic numbers (ports, timeouts, etc.)
			// Disable security rules for config files (they use dynamic requires/imports)
			'security/detect-non-literal-require': 'off',
			'security/detect-non-literal-fs-filename': 'off',
			'max-lines-per-function': 'off',
			'max-params': 'off',
			complexity: 'off',
			'max-depth': 'off',
			'max-statements': 'off',
			'max-nested-callbacks': 'off',
		},
	},
	// Config files override - JavaScript config files (no TypeScript project)
	{
		files: ['eslint.config.js', 'postcss.config.*', '**/*.config.{js,mjs,cjs}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				// Don't use project for JS files - use allowDefaultProject instead
				projectService: {
					allowDefaultProject: ['*.js', '*.mjs', '*.cjs'],
				},
			},
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-console': 'off',
			'unicorn/prefer-module': 'off',
			'max-lines': 'off',
			'no-magic-numbers': 'off', // Config files often use magic numbers (ports, timeouts, etc.)
			// Disable security rules for config files (they use dynamic requires/imports)
			'security/detect-non-literal-require': 'off',
			'security/detect-non-literal-fs-filename': 'off',
			'max-lines-per-function': 'off',
			'max-params': 'off',
			complexity: 'off',
			'max-depth': 'off',
			'max-statements': 'off',
			'max-nested-callbacks': 'off',
			// Disable TypeScript-specific rules for JS files
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	// File-specific overrides following strict max-lines policy
	// UI Components: 200 file, 40 function, 5 params, 15 complexity, 4 depth, 30 statements, 3 nested callbacks - error level
	{
		files: ['src/domains/**/components/**/*.{ts,tsx}', 'src/shared/**/components/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 5],
			complexity: ['error', 15],
			'max-depth': ['error', 4],
			'max-statements': ['error', 30],
			'max-nested-callbacks': ['error', 3],
		},
	},
	// Hooks: 150 file,30 function, 3 params, 8 complexity, 3 depth, 15 statements, 2 nested callbacks - error level
	{
		files: ['src/domains/**/hooks/**/*.{ts,tsx}', 'src/shared/**/hooks/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 30, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 3],
			complexity: ['error', 8],
			'max-depth': ['error', 3],
			'max-statements': ['error', 15],
			'max-nested-callbacks': ['error', 2],
		},
	},
	// Core Hooks: 200 file, 50 function, 3 params, 12 complexity, 4 depth, 20 statements, 3 nested callbacks - error level
	// Core hooks are foundational utilities and may need more flexibility
	{
		files: ['src/core/**/hooks/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 3],
			complexity: ['error', 12],
			'max-depth': ['error', 4],
			'max-statements': ['error', 20],
			'max-nested-callbacks': ['error', 3],
		},
	},
	// Core UI Handlers: 250 file, 50 function, 3 params, 12 complexity, 4 depth, 20 statements, 3 nested callbacks - error level
	// Handler files may need more flexibility for complex event handling logic
	{
		files: ['src/core/ui/**/*.handlers.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 3],
			complexity: ['error', 12],
			'max-depth': ['error', 4],
			'max-statements': ['error', 20],
			'max-nested-callbacks': ['error', 3],
		},
	},
	// Services/API: 200 file, 40 function, 4 params, 12 complexity, 4 depth, 20 statements, 3 nested callbacks - error level
	{
		files: ['src/domains/**/services/**/*.{ts,tsx}', 'src/shared/**/services/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 4],
			complexity: ['error', 12],
			'max-depth': ['error', 4],
			'max-statements': ['error', 20],
			'max-nested-callbacks': ['error', 3],
		},
	},
	// Infrastructure adapters: 200 file, 25 function, 4 params, 10 complexity, 4 depth, 18 statements, 3 nested callbacks - error level
	// Infrastructure adapters implement ports/interfaces and wrap external services. They should be thin, focused wrappers.
	// Complexity limits encourage simple adapters that delegate to external APIs rather than containing complex logic.
	{
		files: ['src/infrastructure/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 25, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 4],
			complexity: ['error', 10],
			'max-depth': ['error', 4],
			'max-statements': ['error', 18],
			'max-nested-callbacks': ['error', 3],
		},
	},
	// Handlers/Utils: 150 file, 40 function, 3 params, 6 complexity, 3 depth, 12 statements, 2 nested callbacks - error level
	{
		files: [
			'src/domains/**/handlers/**/*.{ts,tsx}',
			'src/domains/**/commands/**/*.{ts,tsx}',
			'src/domains/**/queries/**/*.{ts,tsx}',
			'src/**/utils/**/*.{ts,tsx}',
			'src/**/helpers/**/*.{ts,tsx}',
		],
		rules: {
			'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 3],
			complexity: ['error', 6],
			'max-depth': ['error', 3],
			'max-statements': ['error', 12],
			'max-nested-callbacks': ['error', 2],
		},
	},
	// Types: 300 file - warn level (Type definitions don't have "functions", params, complexity, depth, statements, nested callbacks)
	{
		files: ['**/*.types.ts', '**/*.d.ts', '**/types/**/*.ts', '**/models/**/*.ts'],
		rules: {
			'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': 'off',
			'max-params': 'off',
			complexity: 'off',
			'max-depth': 'off',
			'max-statements': 'off',
			'max-nested-callbacks': 'off',
		},
	},
	// Stories (Storybook): 400 file, 40 function, 4 params, 10 complexity, 3 depth, 25 statements, 2 nested callbacks - warn level
	{
		files: ['**/*.stories.{ts,tsx}', '**/.storybook/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['warn', { max: 40, skipBlankLines: true, skipComments: true }],
			'max-params': ['warn', 4],
			complexity: ['warn', 10],
			'max-depth': ['warn', 3],
			'max-statements': ['warn', 25],
			'max-nested-callbacks': ['warn', 2],
		},
	},
	// SSR-related files: Allow runtime checks on globalThis.window/document which are necessary for SSR safety
	// TypeScript types assume these exist, but they're undefined at runtime in SSR environments
	{
		files: [
			'src/**/storage/**/*.{ts,tsx}',
			'src/**/providers/**/*.{ts,tsx}',
			'src/**/hooks/useLocalStorage.{ts,tsx}',
		],
		rules: {
			// Allow unnecessary condition checks for SSR runtime safety (globalThis.window/document checks)
			'@typescript-eslint/no-unnecessary-condition': 'off',
			// Allow optional chaining on globalThis.window for SSR safety
			'@typescript-eslint/prefer-optional-chain': 'warn',
		},
	},
	// Config files: Allow import.meta.env access (these files are responsible for validating and exposing env)
	{
		files: ['src/core/config/**/*.ts'],
		rules: {
			// Allow import.meta.env access in config files (they validate and expose it)
			'no-restricted-syntax': [
				'warn',
				{
					selector: 'MemberExpression[object.name="window"][property]',
					message: 'Use globalThis.window instead of window.',
				},
				// Note: import.meta.env restriction is intentionally excluded here for config files
			],
		},
	},
	// Security files: 300 file, 30 function, 3 params, 10 complexity, 4 depth, 20 statements, 3 nested callbacks - error level
	// Security-critical code should be strict to ensure maintainability and security. Files should be well-organized and focused.
	// Aligned with industry best practices: Clean Code recommends ~300 lines, Google Style Guide ~400 lines.
	// Security utilities with extensive validation should be split into focused modules when exceeding limits.
	{
		files: ['src/core/security/**/*.{ts,tsx}'],
		rules: {
			'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: 30, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', 3],
			complexity: ['error', 10],
			'max-depth': ['error', 4],
			'max-statements': ['error', 20],
			'max-nested-callbacks': ['error', 3],
		},
	},
	// Regex constants: Allow nested quantifiers in IPv4/IPv6 patterns for readability
	// These patterns use bounded, fixed repetitions that are safe in practice:
	// - IPv4: (?:\d{1,3}\.){3} - fixed 3 repetitions, inner quantifier is bounded (1-3)
	// - IPv6: (?:[\da-f]{1,4}:){7} - fixed 7 repetitions, inner quantifier is bounded (1-4)
	// The linter's ReDoS detection is conservative and flags any nested quantifier,
	// but these specific patterns are safe due to their bounded, fixed nature.
	{
		files: ['src/core/constants/regex.ts'],
		rules: {
			'security/detect-unsafe-regex': 'off',
		},
	},
	prettierConfig,
];
