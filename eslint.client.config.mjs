import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import fp from "eslint-plugin-fp";

export default [
  js.configs.recommended,

  {
    files: ["**/*.jsx"],
    plugins: {
      "react-hooks": reactHooks,
      fp,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readable",
        console: "readable",
        window: "readable",
        document: "readable",
        process: "readable",
        setTimeout: "readable",
        clearTimeout: "readable",
        setInterval: "readable",
        clearInterval: "readable",
      },
    },

    rules: {
      // ─── Functional Programming: No Mutations ────────────────────────
      "fp/no-mutation": ["error", {
        allowThis: false,
        exceptions: [{ object: "module", property: "exports" }],
      }],
      "fp/no-mutating-methods": "error",  // blocks .push() .pop() .splice() etc.
      "fp/no-mutating-assign": "error",   // blocks Object.assign() mutating target
      "fp/no-delete": "error",            // blocks delete keyword
      "prefer-const": "error",
      "no-var": "error",
      "no-unused-vars": "off",

      // ─── Functional Programming: No Imperative Loops ─────────────────
      "fp/no-loops": "error",
      "fp/no-let": "error",

      // ─── Functional Programming: No OOP ──────────────────────────────
      "fp/no-class": "error",
      "fp/no-this": "error",
      "fp/no-throw": "warn",              // warn only — sometimes unavoidable

      // ─── Functional Programming: Purity ──────────────────────────────
      "fp/no-nil": "off",                 // null/undefined are fine in React
      "fp/no-unused-expression": "off",   // too strict for JSX handlers

      // ─── No Mutation of Function Arguments ───────────────────────────
      "no-param-reassign": ["error", {
        props: true,
        ignorePropertyModificationsFor: [],
      }],

      // ─── Prefer Declarative over Imperative ──────────────────────────
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForStatement",
          message: "No for loops — use .map() / .filter() / .reduce() instead.",
        },
        {
          selector: "ForInStatement",
          message: "No for...in — use Object.entries() or Object.keys() instead.",
        },
        {
          selector: "ForOfStatement",
          message: "No for...of — use .map() / .filter() / .reduce() instead.",
        },
        {
          selector: "WhileStatement",
          message: "No while loops — use recursion or array methods instead.",
        },
        {
          selector: "DoWhileStatement",
          message: "No do...while loops — use recursion or array methods instead.",
        },
        {
          selector: "SwitchStatement",
          message: "No switch — use object lookup maps or ternaries instead.",
        },
        {
          selector: "ClassDeclaration",
          message: "No classes — use functional components and plain functions.",
        },
        {
          selector: "ClassExpression",
          message: "No classes — use functional components and plain functions.",
        },
      ],

      // ─── React Hooks (ESLint 10 compatible) ──────────────────────────
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
    },
  },

  // ─── Ignore build artifacts ───────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "coverage/**",
      "*.min.js",
      "**/*.test.js",
      "**/store/**",
      "**/index.js",
      "**/webpack.config.js",
      "**/setupTests.js",
      "**/App.js"
    ],
  },
];
