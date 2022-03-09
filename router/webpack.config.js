const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const PROJECT_PATH = './'

module.exports = {
    entry: {
        history: path.resolve(PROJECT_PATH, './src/history.js'),
    },
    output: {
        filename: `js/[name].js`,
        path: path.resolve(PROJECT_PATH, './dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(PROJECT_PATH, './src/history.html'),
            filename: 'index.html',
            cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
            minify: false
          }),
    ],
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000
    }
}