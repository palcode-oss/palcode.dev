import MonacoEditor from 'react-monaco-editor';
import React, { useEffect, useMemo, useState } from 'react';
import { useFileContent } from '../helpers/taskContent';
import {editor} from 'monaco-editor';
import styles from '../styles/editor.module.scss';
import last from 'lodash/last';

interface ThemeNamePair {
    displayName: string;
    normalisedName: string;
}

const availableThemes: ThemeNamePair[] = [
    {
        displayName: 'Blackboard',
        normalisedName: 'blackboard',
    }
];

export default function FileEditor(
    {
        taskId,
        fileName,
        readOnly,
    }: {
        taskId: string,
        fileName: string,
        readOnly: boolean,
    }
) {
    const [loading, fileContent, setFileContent] = useFileContent(taskId, fileName);
    const [themeName, setThemeName] = useState<ThemeNamePair>(availableThemes[0]);
    const [currentThemeDownloaded, setCurrentThemeDownloaded] = useState(false);

    useEffect(() => {
        setCurrentThemeDownloaded(false);
        fetch('https://cdn.jsdelivr.net/npm/monaco-themes@latest/themes/' + themeName.displayName + '.json')
            .then(res => res.json())
            .then(data => {
                editor.defineTheme(themeName.normalisedName, data);
                setCurrentThemeDownloaded(true);
            });
    }, [themeName]);

    const language = useMemo(() => {
        const splitFilename = fileName.split('.');
        if (splitFilename.length === 1) {
            return 'python';
        }

        const extension = last(splitFilename);

        switch (extension) {
            case 'md': return 'markdown';
            case 'txt': return 'plain';
            case 'svg': return 'html';
            case 'html': return 'html';
            case 'py': return 'python';
            default: return 'plaintext';
        }
    }, [fileName]);

    if (loading) {
        return <div className={styles.monacoLoading} />;
    }

    return (
        <div
            className={styles.monacoContainer}
        >
            <MonacoEditor
                language={language}
                theme={currentThemeDownloaded ? themeName.normalisedName : 'vs-dark'}
                value={fileContent}
                onChange={setFileContent}
                width='100%'
                height='100%'
                options={{
                    readOnly,
                }}
            />
        </div>
    )
}
