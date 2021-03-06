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
        taskId,
    } : {
        lastStdout: string,
        lastStdoutID: string,
        enabled: boolean,
        onKey(key: string): void,
        backgroundColor?: string,
        useBlackText?: boolean,
        taskId: string,
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

        const resizeEvent = () => fitAddon.fit();
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        }
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
        const listener = terminal.onData(data => {
            onKey(data);
        });

        return () => {
            listener.dispose();
        }
    }, [onKey]);

    useEffect(() => {
        terminal.write(lastStdout);
    }, [lastStdoutID]);

    useEffect(() => {
        terminal.setOption('disableStdin', !enabled);
    }, [enabled]);

    useEffect(() => {
        terminal.clear();
    }, [taskId]);

    return (
        <div
            ref={terminalContainer}
            className={editor.xtermContainer}
        />
    )
}
