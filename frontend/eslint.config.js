const js = require("@eslint/js");
const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const parserTypescript = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: ["**/node_modules/**", "eslint.config.js"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      sourceType: "module",
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
        localStorage: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
        HTMLElement: "readonly",
        HTMLFormElement: "readonly",
        fetch: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
