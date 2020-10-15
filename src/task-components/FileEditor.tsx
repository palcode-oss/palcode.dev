import MonacoEditor from 'react-monaco-editor';
import React, { useEffect, useMemo } from 'react';
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
    const [themeData, themeLoading] = useMonacoTheme(themePair.displayName);

    useEffect(() => {
        if (themeLoading || !themeData) return;
        editor.defineTheme(themePair.normalisedName, themeData);
        editor.setTheme(themePair.normalisedName);

        const dispose = connectToLanguageServer();

        if (dispose) {
            return () => {
                dispose();
            }
        }
    }, [themeData, themeLoading]);

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
            case 'txt': return 'plain';
            case 'svg': return 'html';
            case 'html': return 'html';
            case 'py': return 'python';
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
                width='100%'
                height='100%'
                options={{
                    readOnly,
                    wordWrap: ['txt', 'md'].includes(extension || '') ? 'on': 'off'
                }}
            />
        </div>
    )
}
