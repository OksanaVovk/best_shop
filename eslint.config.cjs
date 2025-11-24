// eslint.config.cjs
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        fetch: "readonly",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
      },
    },
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
