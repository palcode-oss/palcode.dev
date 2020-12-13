const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    webpack: {
        plugins: [
            new MonacoWebpackPlugin({
                languages: [
                    'python',
                    'javascript',
                    'typescript',
                    'markdown',
                    'html',
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
