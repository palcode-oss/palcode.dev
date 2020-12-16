import MonacoEditor from 'react-monaco-editor';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useFileContent } from '../helpers/taskContent';
import { editor } from 'monaco-editor';
import styles from '../styles/editor.module.scss';
import last from 'lodash/last';
import { ThemeMetadata, useMonacoTheme } from '../helpers/monacoThemes';
import connectToLanguageServer from '../helpers/languageServer';

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
    const [loading, fileContent, setFileContent] = useFileContent(taskId, fileName);
    const [themeData, themeIsBuiltIn, themeLoading] = useMonacoTheme(themePair.displayName);

    const extension = useMemo(() => {
        const splitFilename = fileName.split('.');
        if (splitFilename.length === 1) {
            return 'python';
        }

        return last(splitFilename);
    }, [fileName]);

    useEffect(() => {
        if (themeLoading) return;

        if (!themeIsBuiltIn && themeData) {
            editor.defineTheme(themePair.normalisedName, themeData);
            editor.setTheme(themePair.normalisedName);
        }

        if (extension === 'py') {
            const dispose = connectToLanguageServer();

            if (dispose) {
                return () => {
                    dispose();
                }
            }
        }
    }, [themeData, themeLoading, themeIsBuiltIn, extension]);

    const initResizeListener = useCallback((e: editor.IStandaloneCodeEditor) => {
        const resizeEvent = () => e.layout();

        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        }
    }, []);

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
            default: return 'plaintext';
        }
    }, [extension]);

    if (loading) {
        return <div className={styles.monacoLoading} />;
    }

    return (
        <div
            className={styles.monacoContainer}
        >
            <MonacoEditor
                language={language}
                value={fileContent}
                onChange={setFileContent}
                editorDidMount={initResizeListener}
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
    )
}
