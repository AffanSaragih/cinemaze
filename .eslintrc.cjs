// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh', 'import'],
  settings: {
    // >>> penting: pakai resolver typescript agar alias @ dan tsconfig terbaca
    'import/resolver': {
      typescript: {
        // tsconfig yang dipakai project
        project: ['./tsconfig.app.json', './tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.d.ts'],
      },
    },
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    // >>> abaikan import dengan suffix ?react (SVG component via svgr)
    'import/no-unresolved': ['error', { ignore: ['\\?react$'] }],
    'comma-dangle': 'off',
    semi: 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
};
