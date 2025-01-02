// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:vue/vue3-essential",
    // "@vue/standard",
  ],
  plugins: [
    "vue",
  ],
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  rules: {
    "indent": ["error", 2],
    "arrow-parens": ["error", "always"],
    "linebreak-style": ["error", "unix"],
    semi: [2, "never"],
    "no-console": "off",
    "no-debugger": "warn",
    "vue/no-unused-vars": "warn",
    "no-var": "error",
    "no-trailing-spaces": "error",
    "vue/html-indent": "error",
    "vue/attribute-hyphenation": "error",
    // "space-before-function-paren": ["error", "never"],
    "vue/mustache-interpolation-spacing": ["error", "always"],
    "vue/no-setup-props-destructure": "warn",
    //quotes: [2, "double", { avoidEscape: true, allowTemplateLiterals: true }],
    quotes: "off",
    "no-unused-vars": "warn",
    // "vue/no-static-inline-styles": [ "error", { allowBinding: true } ],
    "comma-dangle": ["error", {
      objects: "always-multiline",
      arrays: "always-multiline",
      imports: "never",
      exports: "never",
      functions: "never",
    }],
    "vue/max-attributes-per-line": [1, {
      "singleline": {
        "max": 6,
      },
      "multiline": {
        "max": 1,
      },
    }],
  },
  globals: {
    Vue: "readonly",
    axios: "readonly",
    globalError: "readonly",
    window: "readonly",
    Window: "readonly",
    document: "readonly",
  },
  types: {
    HTMLFormElement: "readonly",
  },
  // settings: {
  //   "import/resolver": {
  //     alias: {
  //       map: [["@", "./src"]],
  //       extensions: [".js", ".ts", ".vue"],
  //     },
  //   },
  // },
}
