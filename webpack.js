const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');

module.exports = () => {
    const env = dotenv.config().parsed || {};
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});
    return {
        mode: 'development',
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts|tsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/env',
                                    '@babel/preset-react',
                                    [
                                        '@babel/preset-typescript',
                                        { allExtensions: true, isTSX: true },
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        'css-loader',
                    ],
                },
                {
                    test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
                    use: 'file-loader?name=[name].[ext]?[hash]',
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new webpack.ProvidePlugin({
                react: 'react',
                'react-dom': 'react-dom',
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src', 'index.html'),
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
    };
};
