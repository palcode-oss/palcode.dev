import { killCode, runCode, stdin, useSocket, useStdout } from '../helpers/socket';
import React, { useCallback } from 'react';
import XtermWrapper from './XtermWrapper';

export default function Console(
    {
        taskId,
    }: {
        taskId: string,
    }
) {
    const socket = useSocket();

    const [lastStdout, lastStdoutID, running] = useStdout(socket);

    const run = useCallback(() => {
        runCode(socket, taskId);
    }, []);

    const kill = useCallback(() => {
        killCode(socket, taskId);
    }, []);

    const onKey = useCallback((key: string) => {
        stdin(socket, taskId, key);
    }, [running]);

    return (
        <div className='console'>
            {!running && (
                <button
                    onClick={run}
                >
                    Run
                </button>
            )}

            {running && (
                <button
                    onClick={kill}
                >
                    Kill
                </button>
            )}

            <XtermWrapper
                lastStdout={lastStdout}
                lastStdoutID={lastStdoutID}
                onKey={onKey}
                enabled={running}
            />
        </div>
    )
}
