module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "listWidget": true
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
      'no-unused-vars': [
        "error",
        {
          "vars": "all",
          "args": "none",
          "caughtErrors": "none"
        }
      ],
      'require-yield': 0
    }
};