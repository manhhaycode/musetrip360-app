/**
 * @fileoverview ESLint configuration for Vite projects
 * @author MuseTrip360
 */

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "./prettier.config.js";

/**
 * Vite ESLint configuration
 * Optimized for Vite-based applications and package building
 * Includes TypeScript, React, Vite-specific optimizations, and Prettier integration
 */
export default [
  js.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
        // Vite globals
        import: "readonly",
        // Vite environment variables
        VITE_APP_TITLE: "readonly",
        VITE_APP_VERSION: "readonly",
        // Development globals
        __DEV__: "readonly",
        // Build-time globals
        __PROD__: "readonly",
        __TEST__: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
        },
      },
    },
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    rules: {
      // Prettier integration
      "prettier/prettier": ["error", prettierConfig],

      // React rules optimized for Vite
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".tsx", ".jsx"] },
      ],
      "react/jsx-props-no-spreading": "off", // Allow props spreading
      "react/require-default-props": "off", // Using TypeScript
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-const": "error",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          "ts-check": "allow-with-description",
        },
      ],

      // Import rules optimized for Vite
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
          mjs: "never",
        },
      ],
      "import/prefer-default-export": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.{ts,tsx}",
            "**/*.spec.{ts,tsx}",
            "**/*.stories.{ts,tsx}",
            "**/jest.config.{js,ts}",
            "**/jest.setup.{js,ts}",
            "**/vitest.config.{js,ts}",
            "**/vite.config.{js,ts}",
            "**/rollup.config.{js,ts}",
            "**/webpack.config.{js,ts}",
            "**/*.config.{js,ts}",
            "**/scripts/**",
            "**/tools/**",
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "vite",
              group: "external",
              position: "before",
            },
            {
              pattern: "vitest",
              group: "external",
              position: "before",
            },
            {
              pattern: "@vitejs/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
            {
              pattern: "*.css",
              group: "index",
              position: "after",
            },
            {
              pattern: "*.{scss,sass,less,styl}",
              group: "index",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "type"],
        },
      ],
      "import/no-default-export": "off", // Allow default exports

      // Accessibility rules
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img", "object", "area", 'input[type="image"]'],
          img: ["Image"],
          object: ["Object"],
          area: ["Area"],
          'input[type="image"]': ["InputImage"],
        },
      ],
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",

      // Vite-specific and general code quality rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-unused-expressions": "warn",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "spaced-comment": ["error", "always", { exceptions: ["-", "+"] }],
      yoda: "error",
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",

      // Vite environment variable validation
      "no-undef": "error",
      "no-restricted-globals": [
        "error",
        {
          name: "process",
          message:
            "Use import.meta.env instead of process.env in Vite projects.",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'MemberExpression[object.name="process"][property.name="env"]',
          message:
            "Use import.meta.env instead of process.env in Vite projects.",
        },
      ],
    },
  },
  {
    // Vite configuration files
    files: ["vite.config.{js,ts}", "vitest.config.{js,ts}"],
    rules: {
      "no-console": "off", // Allow console in config files
      "@typescript-eslint/no-var-requires": "off", // Allow require in config files
      "import/no-extraneous-dependencies": "off", // Allow dev dependencies in config
    },
  },
  {
    // Package build files
    files: ["build/**/*", "dist/**/*"],
    rules: {
      // Disable all rules for built files
      "prettier/prettier": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
