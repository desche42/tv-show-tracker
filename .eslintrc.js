module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
			"eslint:recommended"
		],
    "globals": {
        "Atomics": "readonly",
				"SharedArrayBuffer": "readonly",
				"describe": "readonly",
				"it": "readonly",
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
			"no-unused-vars": ["warn", { "ignoreRestSiblings": true }]
    }
};
