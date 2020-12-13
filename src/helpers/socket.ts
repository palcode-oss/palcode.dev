import io from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import normaliseKey from './xterm-key-mapper';

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

export function useSocket(): SocketIOClient.Socket {
    return useMemo(() => {
        if (!process.env.REACT_APP_XTERM) {
            throw new TypeError('Xterm socket URL is undefined');
        }

        return io(process.env.REACT_APP_XTERM);
    }, []);
}

export function runCode(socket: SocketIOClient.Socket, taskId: string): void {
    socket.emit('start', {
        projectId: taskId,
    });
}

export function useStdout(socket: SocketIOClient.Socket, taskId: string): [string, string, boolean] {
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

        socket.addEventListener('run', onStdout);
        return () => {
            socket.removeEventListener('run', onStdout);
        }
    }, []);

    useEffect(() => {
        setRunning(false);
    }, [taskId]);

    return [stdout, stdoutID, running];
}

export function stdin(socket: SocketIOClient.Socket, taskId: string, text: string): void {
    socket.emit('stdin', {
        projectId: taskId,
        stdin: text,
    });
}

export function killCode(socket: SocketIOClient.Socket, taskId: string): void {
    socket.emit('stop', {
        projectId: taskId,
    });
}
