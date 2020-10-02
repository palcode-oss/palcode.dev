import MonacoEditor from 'react-monaco-editor';
import React from 'react';
import { useFileContent } from '../helpers/taskContent';

export default function FileEditor(
    {
        taskId,
        fileName,
    }: {
        taskId: string,
        fileName: string,
    }
) {
    const [loading, fileContent, setFileContent] = useFileContent(taskId, fileName);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <MonacoEditor
            width='800'
            height='600'
            language='python'
            theme='vs-dark'
            value={fileContent}
            onChange={setFileContent}
        />
    )
}
