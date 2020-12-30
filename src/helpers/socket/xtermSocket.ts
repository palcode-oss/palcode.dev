import { useEffect, useState } from 'react';
import normaliseKey from '../xtermKeyMapper';
import { TaskLanguage } from '../../types';
import sendSerializedMessage from './send';
import parseMessage, { RunStatus } from './parse';
import connectToSocket from './connect';
import { useDispatch } from 'react-redux';
import { RunnerActions } from '../../stores/runner';
import { Dispatch } from '@reduxjs/toolkit';

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
export function useStdout(
    taskId: string,
    socket?: WebSocket,
): [Stdout, StdoutID] {
    const [stdout, setStdout] = useState('');
    const [stdoutID, setStdoutID] = useState('');
    const dispatch = useDispatch<Dispatch>();

    useEffect(() => {
        function onStdout(event: MessageEvent) {
            const data = parseMessage(event.data);
            if (!data) return;

            if (typeof data.running === "boolean") {
                dispatch({
                    type: data.running ? RunnerActions.setRunning : RunnerActions.setStopped,
                });
            }

            if (data.status === RunStatus.Continuing && data.stdout) {
                setStdout(normaliseKey(data.stdout));
                setStdoutID(Math.random().toString());
            }

            if (data.status === RunStatus.ServerError) {
                dispatch({
                    type: RunnerActions.setStopped,
                });
            }
        }

        if (!socket) return;

        socket.addEventListener('message', onStdout);
        return () => {
            socket.removeEventListener('message', onStdout);
        }
    }, [socket]);

    useEffect(() => {
        dispatch({
            type: RunnerActions.setStopped,
        });
    }, [taskId]);

    return [stdout, stdoutID];
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
