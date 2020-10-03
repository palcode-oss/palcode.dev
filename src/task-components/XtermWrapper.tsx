import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import editor from '../styles/editor.module.scss';

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

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalContainer.current);
        fitAddon.fit();
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
            className={editor.xtermContainer}
        />
    )
}
