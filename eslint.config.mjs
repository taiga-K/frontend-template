import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // Component organization rules based on AGENTS.md
      // Dependency rules (see AGENTS.md lines 436-439, 471):
      // - Pages: can import Models, Layouts, UI, Functional, ui/
      // - Layouts: can import UI, Functional, other Layouts, ui/ (NOT Pages, NOT Models)
      // - Models: can import UI, Functional, other Models, ui/ (NOT Pages, NOT Layouts)
      // - UI: can import Functional, other UI, ui/ (NOT Pages, NOT Layouts, NOT Models)
      // - Functional: can import other Functional, ui/ only (lowest layer)
      // - ui/: cannot import from any component layer
      
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Layouts: can import UI, Functional, ui/, and other Layouts (NOT Pages, NOT Models)
            {
              target: './src/components/Layouts',
              from: './src/components/Pages',
              message: 'Layouts components cannot import from Pages.',
            },
            {
              target: './src/components/Layouts',
              from: './src/components/Models',
              message: 'Layouts components cannot import from Models. Layouts can only import from UI, Functional, other Layouts, and src/ui/.',
            },
            
            // Models: can import UI, Functional, ui/, and other Models (NOT Pages, NOT Layouts)
            {
              target: './src/components/Models',
              from: './src/components/Pages',
              message: 'Models components cannot import from Pages.',
            },
            {
              target: './src/components/Models',
              from: './src/components/Layouts',
              message: 'Models components cannot import from Layouts. Models can only import from UI, Functional, other Models, and src/ui/.',
            },
            
            // UI: can import Functional, ui/, and other UI (NOT Pages, NOT Layouts, NOT Models)
            {
              target: './src/components/UI',
              from: './src/components/Pages',
              message: 'UI components cannot import from Pages.',
            },
            {
              target: './src/components/UI',
              from: './src/components/Layouts',
              message: 'UI components cannot import from Layouts. UI can only import from Functional, other UI, and src/ui/.',
            },
            {
              target: './src/components/UI',
              from: './src/components/Models',
              message: 'UI components cannot import from Models. UI can only import from Functional, other UI, and src/ui/.',
            },
            
            // Functional: can only import ui/ and other Functional (NOT Pages, NOT Layouts, NOT Models, NOT UI)
            {
              target: './src/components/Functional',
              from: './src/components/Pages',
              message: 'Functional components cannot import from Pages.',
            },
            {
              target: './src/components/Functional',
              from: './src/components/Layouts',
              message: 'Functional components cannot import from Layouts. Functional can only import from other Functional and src/ui/.',
            },
            {
              target: './src/components/Functional',
              from: './src/components/Models',
              message: 'Functional components cannot import from Models. Functional can only import from other Functional and src/ui/.',
            },
            {
              target: './src/components/Functional',
              from: './src/components/UI',
              message: 'Functional components cannot import from UI. Functional can only import from other Functional and src/ui/.',
            },
            
            // UI Infrastructure Layer (src/ui/): cannot import from any component layer
            {
              target: './src/ui',
              from: './src/components',
              message: 'UI infrastructure layer (src/ui/) cannot import from any component layer (src/components/). It should only depend on external libraries.',
            },
          ],
        },
      ],
    },
  },
  {
    // Special rule for Next.js pages directory (src/pages/)
    // Next.js routing pages can import from ALL component categories including Layouts
    files: ['src/pages/**/*.ts', 'src/pages/**/*.tsx'],
    rules: {
      'import/no-restricted-paths': 'off',
    },
  },
];
