import { killCode, runCode, stdin, useSocket, useStdout } from '../helpers/socket';
import React, { useCallback } from 'react';
import XtermWrapper from './XtermWrapper';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSkull } from '@fortawesome/free-solid-svg-icons';

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
    }, [taskId]);

    const kill = useCallback(() => {
        killCode(socket, taskId);
    }, [taskId]);

    const onKey = useCallback((key: string) => {
        stdin(socket, taskId, key);
    }, [running, taskId]);

    return (
        <div className={editor.console}>
            {!running && (
                <button
                    onClick={run}
                    className={editor.runButton}
                >
                    <FontAwesomeIcon icon={faPlay} />
                    &nbsp;Run
                </button>
            )}

            {running && (
                <button
                    onClick={kill}
                    className={editor.killButton}
                >
                    <FontAwesomeIcon icon={faSkull} />
                    &nbsp;Kill
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
