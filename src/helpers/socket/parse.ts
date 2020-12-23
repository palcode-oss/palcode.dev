import { decode } from 'js-base64';

export enum RunStatus {
    Failed = 500,
    Continuing = 200,
    BadRequest = 400,
    ProjectNotFound = 404,
    ServerError = 500,
}

export interface RunMessage {
    status: RunStatus;
    message?: string;
    running?: boolean;
    stdout?: string;
    stdoutID?: string;
}

export default function parseMessage(message: string): RunMessage | undefined {
    let data;
    try {
        const stringJSON = decode(message);
        data = JSON.parse(stringJSON);
    } catch (e) {
        return;
    }

    return data as RunMessage;
}
