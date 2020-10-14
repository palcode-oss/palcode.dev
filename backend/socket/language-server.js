const rpc = require('vscode-ws-jsonrpc');
const server = require('vscode-ws-jsonrpc/lib/server');
const lsp = require('vscode-languageserver');
const ws = require("ws");

function launch (socket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const socketConnection = server.createConnection(reader, writer, () => socket.dispose());
    const serverConnection = server.createServerProcess('JSON', 'pyls');
    server.forward(socketConnection, serverConnection, message => {
        if (rpc.isRequestMessage(message)) {
            if (message.method === lsp.InitializeRequest.type.method) {
                const initializeParams = message.params;
                initializeParams.processId = process.pid;
            }
        }
        return message;
    });
}

module.exports = {
    init() {
        const wss = new ws.Server({
            port: 442,
            perMessageDeflate: false,
        });

        wss.on('connection', (client) => {
            const iWebSocket = {
                send: content => client.send(content),
                onMessage: cb => client.onmessage = event => cb(event.data),
                onError: cb => client.onerror = event => {
                    if ('message' in event) {
                        cb(event.message)
                    }
                },
                onClose: cb => client.onclose = event => cb(event.code, event.reason),
                dispose: () => client.close()
            };

            launch(iWebSocket);
        });
    }
}
