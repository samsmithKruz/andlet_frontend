import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
       '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
       '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
       '@typescript-eslint/no-empty-function': 'off',
       '@typescript-eslint/consistent-type-imports': 'error',
       '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
       '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
       '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow-as-parameter' }],
       '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
       '@typescript-eslint/no-non-null-assertion': 'off',
       '@typescript-eslint/no-empty-interface': 'off',
       '@typescript-eslint/no-misused-promises': 'off',
       '@typescript-eslint/no-namespace': 'off',
       '@typescript-eslint/no-var-requires': 'off',
       '@typescript-eslint/prefer-optional-chain': 'error',
       '@typescript-eslint/prefer-nullish-coalescing': 'error',
       '@typescript-eslint/prefer-readonly': 'error',
       '@typescript-eslint/prefer-readonly-parameter-types': 'off',
       '@typescript-eslint/prefer-regexp-exec': 'off',
       '@typescript-eslint/prefer-string-starts-ends-with': 'off',
       '@typescript-eslint/prefer-ts-expect-error': 'off',
       '@typescript-eslint/require-await': 'off',
       '@typescript-eslint/restrict-template-expressions': 'off',
       '@typescript-eslint/strict-boolean-expressions': 'off',
       '@typescript-eslint/unified-signatures': 'error',
    },
  },
])
