module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	// 'extends': [
	// 	// add more generic rulesets here, such as:
	// 	// 'eslint:recommended',
	// 	'plugin:jsonc/base',
	// 	'plugin:jsonc/recommended-with-json',
	// 	'plugin:jsonc/recommended-with-jsonc'
	//   ],
	'overrides': [
		{
			'env': {
				'node': true
			},
			'files': [
				'.eslintrc.{js,cjs}'
			],
			'parserOptions': {
				'sourceType': 'script'
			}
		}
	],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'indent': [
			'warn',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		// 'jsonc/quotes': [
		// 	'warn',
		// 	'double',
		// 	{ 'avoidEscape': false }
		// ],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};

