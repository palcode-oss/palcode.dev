import { killCode, runCode, stdin, useSocket, useStdout } from '../helpers/xtermSocket';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import XtermWrapper from './XtermWrapper';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSkull } from '@fortawesome/free-solid-svg-icons';
import { ThemeMetadata, useMonacoTheme } from '../helpers/monacoThemes';
import { TaskLanguage } from '../types';
import { useSchoolId } from '../helpers/school';

export default function Console(
    {
        taskId,
        taskLanguage,
        themeMetadata,
    }: {
        taskId: string,
        taskLanguage?: TaskLanguage,
        themeMetadata?: ThemeMetadata,
    }
) {
    const socket = useSocket();

    const [lastStdout, lastStdoutID, running] = useStdout(taskId, socket);

    const schoolId = useSchoolId();
    const [loading, setLoading] = useState(false);
    const run = useCallback(() => {
        if (!taskLanguage || !schoolId || loading) return;
        setLoading(true);
        runCode(taskId, taskLanguage, schoolId, socket);
    }, [taskId, taskLanguage, socket, schoolId, loading]);

    useEffect(() => {
        setLoading(false);
    }, [running, lastStdoutID]);

    const kill = useCallback(() => {
        killCode(taskId, socket);
    }, [taskId, socket]);

    const onKey = useCallback((key: string) => {
        stdin(taskId, key, socket);
    }, [running, taskId, socket]);

    const [themeData, themeIsBuiltIn] = useMonacoTheme(themeMetadata?.displayName);
    const xtermBackground = useMemo<string | undefined>(() => {
        if (themeIsBuiltIn) {
            switch (themeMetadata?.normalisedName) {
                case 'vs-dark':
                    return '#1e1e1e';
                case 'vs':
                    return '#ffffff';
                case 'hc-black':
                    return '#000000';
            }
        }

        if (!themeData) return undefined;
        return themeData.colors['editor.background'] || '#000000';
    }, [themeData, themeIsBuiltIn, themeMetadata]);

    return (
        <div className={editor.console}>
            {!running && (
                <button
                    onClick={run}
                    className={loading ? editor.loadingButton : editor.runButton}
                    disabled={!taskLanguage}
                >
                    {
                        loading && 'Starting...'
                    }
                    {
                        !loading && <>
                            <FontAwesomeIcon icon={faPlay} />
                            &nbsp;Run
                        </>
                    }
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
                backgroundColor={xtermBackground}
                useBlackText={themeMetadata?.light}
                taskId={taskId}
            />
        </div>
    )
}
