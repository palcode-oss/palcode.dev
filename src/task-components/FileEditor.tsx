import MonacoEditor from 'react-monaco-editor';
import React, { useEffect, useMemo, useState } from 'react';
import { useFileContent } from '../helpers/taskContent';
import {editor} from 'monaco-editor';
import styles from '../styles/editor.module.scss';
import last from 'lodash/last';
import { ThemeMetadata } from '../helpers/monacoThemes';

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
    const [currentThemeDownloaded, setCurrentThemeDownloaded] = useState(false);

    useEffect(() => {
        setCurrentThemeDownloaded(false);
        fetch('https://cdn.jsdelivr.net/npm/monaco-themes@latest/themes/' + themePair.displayName + '.json')
            .then(res => res.json())
            .then(data => {
                editor.defineTheme(themePair.normalisedName, data);
                setCurrentThemeDownloaded(true);
            });
    }, [themePair]);

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
                theme={currentThemeDownloaded ? themePair.normalisedName : 'vs-dark'}
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
