import { killCode, runCode, stdin, useSocket, useStdout } from '../helpers/socket/xtermSocket';
import React, { useCallback, useEffect, useMemo } from 'react';
import XtermWrapper from './XtermWrapper';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSkull } from '@fortawesome/free-solid-svg-icons';
import { ThemeMetadata, useMonacoTheme } from '../helpers/monacoThemes';
import { useSchoolId } from '../helpers/school';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { RunnerActions, runnerSelector } from '../stores/runner';
import { Dispatch } from '@reduxjs/toolkit';
import { uploaderSelector } from '../stores/uploader';
import { SupportedLanguage } from 'palcode-types';

export default function Console(
    {
        taskId,
        taskLanguage,
        themeMetadata,
    }: {
        taskId: string,
        taskLanguage?: SupportedLanguage,
        themeMetadata?: ThemeMetadata,
    }
) {
    const socket = useSocket();

    const [lastStdout, lastStdoutID] = useStdout(taskId, socket);
    const [running, loading] = useSelector(runnerSelector);
    const uploading = useSelector(uploaderSelector);
    const dispatch = useDispatch<Dispatch>();
    const {enqueueSnackbar} = useSnackbar();

    const schoolId = useSchoolId();
    useEffect(() => {
        if (!taskLanguage || !schoolId) return;

        if (loading && !running) {
            runCode(taskId, taskLanguage, schoolId, socket);
        }
    }, [loading, taskId, taskLanguage, schoolId, socket]);

    const run = useCallback(() => {
        if (uploading) {
            enqueueSnackbar('Please wait for your code to save.', {
                preventDuplicate: true,
                variant: 'info',
                autoHideDuration: 1000,
            });
            return;
        }

        if (loading) return;

        dispatch({
            type: RunnerActions.requestRun,
        });
    }, [loading, uploading]);

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
