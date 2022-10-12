const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');

module.exports = () =>
    merge(common(), {
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin(), new OptimizeCSSAssets()],
        },
        mode: 'production',
    });
