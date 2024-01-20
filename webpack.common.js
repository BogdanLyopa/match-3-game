const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: 'main.bundle.js',
		clean: true,
	},
	devtool: 'inline-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'body',
		}),
		new MiniCssExtractPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif|mp3|mp4|woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/inline',
			},
			{ test: /\\.(png|jp(e*)g|svg|gif)$/, use: ['file-loader'] },

			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
			{
				test: /\.ts?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-typescript'],
						plugins: ['@babel/plugin-transform-runtime'],
					},
				},

				exclude: /node_modules/,
			},
		],
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],

		alias: {
			images: path.resolve(__dirname, 'src/images'),
			utils: path.resolve(__dirname, 'src/utils'),
			scripts: path.resolve(__dirname, 'src/scripts'),
		},
	},
};
