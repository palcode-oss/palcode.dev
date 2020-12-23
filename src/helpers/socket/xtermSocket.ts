import { useEffect, useState } from 'react';
import normaliseKey from '../xtermKeyMapper';
import { TaskLanguage } from '../../types';
import getEnvVariable from '../getEnv';
import sendSerializedMessage from './send';
import parseMessage, { RunStatus } from './parse';
import connectToSocket from './connect';

export function useSocket(): WebSocket | undefined {
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        return connectToSocket(setSocket);
    }, []);

    return socket;
}

export function runCode(
    taskId: string,
    language: TaskLanguage,
    schoolId: string,
    socket?: WebSocket,
): void {
    if (!socket) return;

    sendSerializedMessage(socket, {
        instruction: 'start',
        projectId: taskId,
        schoolId,
        language,
    });
}

type Stdout = string;
type StdoutID = string;
type Running = boolean;
export function useStdout(
    taskId: string,
    socket?: WebSocket,
): [Stdout, StdoutID, Running] {
    const [stdout, setStdout] = useState('');
    const [stdoutID, setStdoutID] = useState('');
    const [running, setRunning] = useState(false);

    useEffect(() => {
        function onStdout(event: MessageEvent) {
            const data = parseMessage(event.data);
            if (!data) return;

            if (typeof data.running === "boolean") {
                setRunning(data.running);
            }

            if (data.status === RunStatus.Continuing && data.stdout) {
                setStdout(normaliseKey(data.stdout));
                setStdoutID(Math.random().toString());
            }

            if (data.status === RunStatus.ServerError) {
                setStdoutID(Math.random().toString());
            }
        }

        if (!socket) return;

        socket.addEventListener('message', onStdout);
        return () => {
            socket.removeEventListener('message', onStdout);
        }
    }, [socket]);

    useEffect(() => {
        setRunning(false);
    }, [taskId]);

    return [stdout, stdoutID, running];
}

export function stdin(
    taskId: string,
    text: string,
    socket?: WebSocket,
): void {
    if (!socket) return;

    sendSerializedMessage(socket, {
        instruction: 'stdin',
        projectId: taskId,
        stdin: text,
    });
}

export function killCode(
    taskId: string,
    socket?: WebSocket,
): void {
    if (!socket) return;

    sendSerializedMessage(socket, {
        instruction: 'stop',
        projectId: taskId,
    });
}
