const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    webpack: {
        plugins: [
            new MonacoWebpackPlugin({
                languages: [
                    'python',
                    'markdown',
                    'html',
                    'xml',
                ]
            }),
        ],
        configure: {
            resolve: {
                alias: {
                    'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
                }
            }
        }
    }
}
