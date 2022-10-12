const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = () =>
    merge(common(), {
        mode: 'development',
        cache: true,
        watch: false,
        devServer: {
            open: true,
            hot: true,
            port: 9000,
            historyApiFallback: true,
        },
        devtool: 'inline-source-map',
    });
