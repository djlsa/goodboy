const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        })
    ],
    output: {
        filename: 'game.js',
        path: distPath
    },
    devServer: {
        contentBase: distPath,
        compress: true,
        port: 9000
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
      }
};