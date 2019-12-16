/* eslint-env node */
'use strict';
const { join } = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
	target: 'web',
	resolve: {
		extensions: ['.ts', '.js']
	},
	entry: {
		index: './src/assets/three/3d.ts',
	},
	output: {
		publicPath: '',
		path: join(__dirname, 'dist')
	},
	performance: {
		hints: false
	},

	devServer: {
		port: 8000,
		publicPath: '',
		clientLogLevel: 'none',
		stats: 'errors-only'
	},

	module: {
		rules: [
			{
				test: /\.(ts|js)$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			}
		]
	},
	plugins: [

		// Resets the output "dist" folder
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: false
		}),
		new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
		// Generates HTML pages
		new HtmlWebpackPlugin({
			title: 'Index',
			chunks: ['index'],
			template: './src/assets/three/3d.html',
			inject: true,
		}),
	]
};


/**
 * The config could be shorter & support additional features
 * (like CSS or Subresource Integrity) using:
 * https://github.com/wildpeaks/package-webpack-config-web
 */
// const getConfig = require('@wildpeaks/webpack-config-web');
//
// module.exports = function(_env, {mode = 'production'} = {}) {
// 	const config = getConfig({
// 		mode,
// 		entry: {
// 			app1: './src/application.ts'
// 			// ...
// 		},
// 		pages: [
// 			{
// 				title: 'Entry app1',
// 				filename: 'app1.html',
// 				chunks: ['app1']
// 			}
// 			// ...
// 		]
// 	});
// 	config.plugins.push(new ThreeWebpackPlugin());
// 	return config;
// };
