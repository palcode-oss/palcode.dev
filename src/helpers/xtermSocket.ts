import io from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import normaliseKey from './xtermKeyMapper';
import { TaskLanguage } from '../types';
import getEnvVariable from './getEnv';

enum RunStatus {
    Failed = 500,
    Continuing = 200,
    BadRequest = 400,
    ProjectNotFound = 404,
}

interface RunMessage {
    status: RunStatus;
    message?: string;
    running?: boolean;
    stdout?: string;
    stdoutID?: string;
}

export function useSocket(): SocketIOClient.Socket | undefined {
    const [socket, setSocket] = useState<SocketIOClient.Socket>();

    useEffect(() => {
        const socketUrl = getEnvVariable('XTERM');
        if (!socketUrl) {
            throw new TypeError('Xterm socket URL is undefined');
        }

        const socketIo = io(socketUrl);
        setSocket(socketIo);

        return () => {
            socketIo.close();
        }
    }, []);

    return socket;
}

export function runCode(taskId: string, language: TaskLanguage, socket?: SocketIOClient.Socket): void {
    if (!socket) return;

    socket.emit('start', {
        projectId: taskId,
        language,
    });
}

export function useStdout(taskId: string, socket?: SocketIOClient.Socket): [string, string, boolean] {
    const [stdout, setStdout] = useState('');
    const [stdoutID, setStdoutID] = useState('');
    const [running, setRunning] = useState(false);

    useEffect(() => {
        function onStdout(data: RunMessage) {
            if (typeof data.running === "boolean") {
                setRunning(data.running);
            }

            if (data.status === RunStatus.Continuing && data.stdout && data.stdoutID) {
                setStdout(normaliseKey(data.stdout));
                setStdoutID(data.stdoutID);
            }
        }

        if (!socket) return;

        socket.addEventListener('run', onStdout);
        return () => {
            socket.removeEventListener('run', onStdout);
        }
    }, [socket]);

    useEffect(() => {
        setRunning(false);
    }, [taskId]);

    return [stdout, stdoutID, running];
}

export function stdin(taskId: string, text: string, socket?: SocketIOClient.Socket): void {
    if (!socket) return;

    socket.emit('stdin', {
        projectId: taskId,
        stdin: text,
    });
}

export function killCode(taskId: string, socket?: SocketIOClient.Socket): void {
    if (!socket) return;

    socket.emit('stop', {
        projectId: taskId,
    });
}
