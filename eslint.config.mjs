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
      // Dependency rules (see AGENTS.md lines 139-146):
      // - Pages: can import Models, Base, Functional, design-system/ (NOT Layouts)
      // - Layouts: can import Base, Functional, other Layouts, design-system/ (NOT Pages, NOT Models)
      // - Models: can import Base, Functional, other Models, design-system/ (NOT Pages, NOT Layouts)
      // - Base: can import Functional, other Base, design-system/ (NOT Pages, NOT Layouts, NOT Models)
      // - Functional: can import other Functional, design-system/ only (lowest layer)
      // - design-system/: cannot import from any component layer
      
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Pages: can import Models, Base, Functional, design-system/ (NOT Layouts)
            {
              target: './src/components/Pages',
              from: './src/components/Layouts',
              message: 'Pages components cannot import from Layouts. Pages can only import from Models, Base, Functional, and src/design-system/.',
            },
            
            // Layouts: can import Base, Functional, design-system/, and other Layouts (NOT Pages, NOT Models)
            {
              target: './src/components/Layouts',
              from: './src/components/Pages',
              message: 'Layouts components cannot import from Pages.',
            },
            {
              target: './src/components/Layouts',
              from: './src/components/Models',
              message: 'Layouts components cannot import from Models. Layouts can only import from Base, Functional, other Layouts, and src/design-system/.',
            },
            
            // Models: can import Base, Functional, design-system/, and other Models (NOT Pages, NOT Layouts)
            {
              target: './src/components/Models',
              from: './src/components/Pages',
              message: 'Models components cannot import from Pages.',
            },
            {
              target: './src/components/Models',
              from: './src/components/Layouts',
              message: 'Models components cannot import from Layouts. Models can only import from Base, Functional, other Models, and src/design-system/.',
            },
            
            // Base: can import Functional, design-system/, and other Base (NOT Pages, NOT Layouts, NOT Models)
            {
              target: './src/components/Base',
              from: './src/components/Pages',
              message: 'Base components cannot import from Pages.',
            },
            {
              target: './src/components/Base',
              from: './src/components/Layouts',
              message: 'Base components cannot import from Layouts. Base can only import from Functional, other Base, and src/design-system/.',
            },
            {
              target: './src/components/Base',
              from: './src/components/Models',
              message: 'Base components cannot import from Models. Base can only import from Functional, other Base, and src/design-system/.',
            },
            
            // Functional: can only import design-system/ and other Functional (NOT Pages, NOT Layouts, NOT Models, NOT Base)
            {
              target: './src/components/Functional',
              from: './src/components/Pages',
              message: 'Functional components cannot import from Pages.',
            },
            {
              target: './src/components/Functional',
              from: './src/components/Layouts',
              message: 'Functional components cannot import from Layouts. Functional can only import from other Functional and src/design-system/.',
            },
            {
              target: './src/components/Functional',
              from: './src/components/Models',
              message: 'Functional components cannot import from Models. Functional can only import from other Functional and src/design-system/.',
            },
            {
              target: './src/components/Functional',
              from: './src/components/Base',
              message: 'Functional components cannot import from Base. Functional can only import from other Functional and src/design-system/.',
            },
            
            // UI Infrastructure Layer (src/design-system/): cannot import from any component layer
            {
              target: './src/design-system',
              from: './src/components',
              message: 'UI infrastructure layer (src/design-system/) cannot import from any component layer (src/components/). It should only depend on external libraries.',
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
