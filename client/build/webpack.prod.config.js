'use strict'

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {

	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'js/[name].[hash].js'
	},

	module: {
		rules: [{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader',
					options: {
						minimize: true
					}
				}],
				publicPath: '../'
			})
		}]
	},


	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'vue-router': 'vue-router/dist/vue-router.esm.js'
		}
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		}),
		new webpack.ProvidePlugin({
			Vue: ['vue', 'default'],
			VueRouter: ['vue-router', 'default']
		}),
		new CleanWebpackPlugin('dist', {
			root: path.resolve(__dirname, '../')
		}),
		new ExtractTextPlugin({
			filename: 'css/styles.[hash].css',

		}),
		new UglifyJSPlugin({
			test: /\.js$/,
			uglifyOptions: {
				ecma: 8
			}
		}),
		new webpack.BannerPlugin({
			banner: `伟大鱼塘 ${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
		}),
		new HtmlWebpackPlugin({
			filename: 'index.ejs',
			template: 'index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			}
		})
	]
});

module.exports = webpackConfig;