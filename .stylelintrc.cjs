module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-scss",
    "stylelint-config-prettier-scss",
  ],
  plugins: ["stylelint-scss"],
  customSyntax: "postcss-scss",
  ignoreFiles: ["dist/**/*.css"],
  rules: {
    "scss/at-function-pattern": null,
    "no-descending-specificity": null,
    "declaration-block-no-redundant-longhand-properties": null,
  },
};
