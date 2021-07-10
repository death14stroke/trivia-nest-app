module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		'react-native-reanimated/plugin',
		[
			'module-resolver',
			{
				extensions: [
					'.js',
					'.jsx',
					'.ts',
					'.tsx',
					'.android.js',
					'.android.tsx',
					'.ios.js',
					'.ios.tsx'
				],
				root: ['.'],
				alias: {
					'@app/screens': './src/screens',
					'@assets': './assets',
					'@app/components': './src/components',
					'@app/navigation': './src/navigation',
					'@app/api': './src/api',
					'@app/models': './src/models',
					'@app/hooks': './src/hooks',
					'@app/context': './src/context',
					'@app/theme': './src/theme'
				}
			}
		]
	]
};
