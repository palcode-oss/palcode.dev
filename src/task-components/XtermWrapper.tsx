import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import editor from '../styles/editor.module.scss';

export default function XtermWrapper(
    {
        lastStdout,
        lastStdoutID,
        enabled,
        onKey,
        backgroundColor,
        useBlackText,
    } : {
        lastStdout: string,
        lastStdoutID: string,
        enabled: boolean,
        onKey(key: string): void,
        backgroundColor?: string,
        useBlackText?: boolean,
    }
): ReactElement {
    const terminalContainer = useRef<HTMLDivElement | null>(null);

    const terminal = useMemo(() => {
        return new Terminal({
            cursorBlink: true,
            allowTransparency: true,
        });
    }, []);

    useEffect(() => {
        if (!terminalContainer.current) {
            return;
        }

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebLinksAddon());
        terminal.setOption('theme', {
            background: '#030027',
        });
        terminal.open(terminalContainer.current);
        fitAddon.fit();
    }, [terminalContainer]);

    useEffect(() => {
        if (backgroundColor) {
            const foregroundColor = useBlackText === true ? '#000000' : '#ffffff';

            terminal.setOption('theme', {
                background: backgroundColor,
                foreground: foregroundColor,
                cursor: foregroundColor,
            });
        }
    }, [backgroundColor, useBlackText]);

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
