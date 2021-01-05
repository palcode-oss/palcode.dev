import MonacoEditor from 'react-monaco-editor';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useFileContent } from '../helpers/taskContent';
import { editor, KeyCode, KeyMod } from 'monaco-editor';
import styles from '../styles/editor.module.scss';
import last from 'lodash/last';
import { ThemeMetadata, useMonacoTheme } from '../helpers/monacoThemes';
import connectToLanguageServer from '../helpers/languageServer';
import { getLanguageFromExtension } from '../helpers/languageData';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { RunnerActions } from '../stores/runner';
import { UploaderActions } from '../stores/uploader';
import { useSchoolId } from '../helpers/school';

export default function FileEditor(
    {
        taskId,
        fileName,
        readOnly,
        themePair,
    }: {
        taskId: string,
        fileName: string,
        readOnly: boolean,
        themePair: ThemeMetadata,
    }
) {
    const [downloading, fileContent, uploading, setFileContent] = useFileContent(taskId, fileName);
    const [themeData, themeIsBuiltIn, themeLoading] = useMonacoTheme(themePair.displayName);
    const dispatch = useDispatch<Dispatch>();

    useEffect(() => {
        dispatch({
            type: uploading ? UploaderActions.setUploading : UploaderActions.completeUpload,
        });
    }, [uploading]);

    const extension = useMemo(() => {
        const splitFilename = fileName.split('.');
        if (splitFilename.length === 1) {
            return 'python';
        }

        return last(splitFilename);
    }, [fileName]);

    const language = useMemo(() => {
        switch (extension) {
            case 'md': return 'markdown';
            case 'txt': return 'plaintext';
            case 'svg': return 'html';
            case 'html': return 'html';
            case 'py': return 'python';
            case 'js': return 'javascript';
            case 'json': return 'json';
            case 'sh': return 'shell';
            case 'java': return 'java';
            case 'pl': return 'plaintext';
            case 'go': return 'go';
            case 'cpp': return 'cpp';
            default: return 'plaintext';
        }
    }, [extension]);

    const schoolId = useSchoolId();
    useEffect(() => {
        if (themeLoading || !schoolId) return;

        if (!themeIsBuiltIn && themeData) {
            editor.defineTheme(themePair.normalisedName, themeData);
            editor.setTheme(themePair.normalisedName);
        }

        if (extension && ['py', 'sh', 'go'].includes(extension)) {
            const lspLanguage = getLanguageFromExtension(extension);
            if (!lspLanguage) return;

            const dispose = connectToLanguageServer(lspLanguage, taskId, schoolId);

            if (dispose) {
                return () => {
                    dispose();
                }
            }
        }
    }, [themeData, themeLoading, themeIsBuiltIn, extension, schoolId]);

    const onEditorMount = useCallback((e: editor.IStandaloneCodeEditor) => {
        e.addAction({
            id: 'ignore-save',
            label: 'Save',
            contextMenuGroupId: 'PalCode',
            keybindings: [
                KeyMod.CtrlCmd | KeyCode.KEY_S
            ],
            run: () => {},
        });

        e.addAction({
            id: 'run',
            label: 'Run',
            contextMenuGroupId: 'PalCode',
            keybindings: [
                KeyMod.CtrlCmd | KeyCode.Enter,
            ],
            run: () => {
                dispatch({
                    type: RunnerActions.requestRun,
                });
            }
        })

        const resizeEvent = () => e.layout();
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        }
    }, []);

    if (downloading) {
        return <div className={styles.monacoLoading} />;
    }

    return <>
        <div className={styles.editorStatus}>
            <p className={uploading ? styles.editorStatusSaving : ''}>
                {uploading && 'Saving...'}
                {!uploading && 'All changes saved'}
            </p>
        </div>

        <div
            className={styles.monacoContainer}
        >
            <MonacoEditor
                language={language}
                value={fileContent}
                onChange={setFileContent}
                editorDidMount={onEditorMount}
                width='100%'
                height='100%'
                options={{
                    readOnly,
                    wordWrap: ['txt', 'md'].includes(extension || '') ? 'on': 'off'
                }}
                theme={
                    themeIsBuiltIn ? themePair.normalisedName : undefined
                }
            />
        </div>
    </>
}
