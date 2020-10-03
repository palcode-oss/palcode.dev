import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import {Terminal} from 'xterm';
import 'xterm/css/xterm.css';

export default function XtermWrapper(
    {
        lastStdout,
        lastStdoutID,
        enabled,
        onKey,
    } : {
        lastStdout: string,
        lastStdoutID: string,
        enabled: boolean,
        onKey(key: string): void,
    }
): ReactElement {
    const terminalContainer = useRef<HTMLDivElement | null>(null);

    const terminal = useMemo(() => {
        return new Terminal({
            cursorBlink: true,
        });
    }, []);

    useEffect(() => {
        if (!terminalContainer.current) {
            return;
        }

        terminal.open(terminalContainer.current);
    }, [terminalContainer]);

    useEffect(() => {
        terminal.onData(data => {
            onKey(data);
        });
    }, []);

    useEffect(() => {
        terminal.write(lastStdout);
    }, [lastStdoutID]);

    useEffect(() => {
        terminal.setOption('disableStdin', !enabled);
    }, [enabled]);

    return (
        <div
            ref={terminalContainer}
        />
    )
}
