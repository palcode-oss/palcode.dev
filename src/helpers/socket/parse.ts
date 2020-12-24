import { decode, isServerMessage, ServerMessage } from 'palcode-sockets';

export enum RunStatus {
    Failed = 500,
    Continuing = 200,
    BadRequest = 400,
    ProjectNotFound = 404,
    ServerError = 500,
}

export default function parseMessage(message: string): ServerMessage | undefined {
    let data;
    try {
        data = decode(message);
    } catch (e) {
        return;
    }

    if (isServerMessage(data)) {
        return data;
    } else {
        return;
    }
}
