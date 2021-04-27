module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [],
  "ignorePatterns": ["*.md"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/class-name-casing": "warn",
    "@typescript-eslint/semi": [
      "warn",
      "never"
    ],
    "curly": "warn",
    "eqeqeq": [
      "warn",
      "always"
    ],
    "no-throw-literal": "warn",
    "semi": [
      "error",
      "never"
    ],
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": true
        }
      }
    ],
    "no-redeclare": "warn",
    "no-unused-expressions": "warn",
  },
  "settings": {}
}
