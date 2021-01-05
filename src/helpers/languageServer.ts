import {
    CloseAction,
    createConnection,
    ErrorAction,
    MonacoLanguageClient,
    MonacoServices,
} from 'monaco-languageclient';
import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import getEnvVariable from './getEnv';
import { TaskLanguage } from '../types';
import { encodeLspInit } from 'palcode-sockets';
import { Uri } from 'monaco-editor';

function createLanguageClient(connection: MessageConnection) {
    return new MonacoLanguageClient({
        name: 'lsp.palcode.dev',
        clientOptions: {
            documentSelector: ['python', 'shell', 'go'],
            workspaceFolder: {
                uri: Uri.file('/usr/src/app'),
                name: 'app',
                index: 0,
            },
            errorHandler: {
                error: () => ErrorAction.Continue,
                // when we close the WebSocket (primarily through webSocket.close()) make sure to stop pyls
                closed: () => CloseAction.DoNotRestart,
            }
        },
        connectionProvider: {
            get(errorHandler, closeHandler) {
                return Promise.resolve(createConnection(
                    // @ts-ignore
                    connection,
                    errorHandler,
                    closeHandler,
                ));
            }
        }
    });
}

type DisposeFunction = () => void;
export default function connectToLanguageServer(
    language: TaskLanguage,
    taskId: string,
    schoolId: string,
): undefined | DisposeFunction {
    const lspURL = getEnvVariable('LSP');
    if (!lspURL) {
        return;
    }

    try {
        MonacoServices.get();
    } catch (e) {
        // @ts-ignore
        MonacoServices.install(require('monaco-editor-core/esm/vs/platform/commands/common/commands').CommandsRegistry);
    }

    const webSocket = new WebSocket(lspURL);
    webSocket.onerror = () => {};
    let webSocketInitComplete = false;

    webSocket.addEventListener('open', () => {
        if (webSocketInitComplete) return;

        webSocket.send(
            encodeLspInit({
                language,
                projectId: taskId,
                schoolId,
            }),
        );
    });

    webSocket.addEventListener('message', (event) => {
        if (event.data !== 'ready') {
            return;
        }

        webSocketInitComplete = true;

        listen({
            webSocket,
            onConnection: (connection) => {
                const client = createLanguageClient(connection);
                const disposable = client.start();
                connection.onClose(() => disposable.dispose());
                connection.onError(() => {});
            },
        });

        webSocket.dispatchEvent(new Event('open'));
    });

    return () => {
        try {
            webSocket.close();
        } catch (e) {}
    };
}
