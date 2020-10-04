import React, { ReactElement, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteRemoteFile, useTaskFiles } from './helpers/taskContent';
import Files from './task-components/Files';
import FileEditor from './task-components/FileEditor';
import Console from './task-components/Console';
import editor from './styles/editor.module.scss';
import Briefing from './task-components/Briefing';

interface Params {
    taskId: string;
}

export default function Task(): ReactElement {
    const { taskId } = useParams<Params>();

    const [currentTab, setCurrentTab] = useState('index.py');
    const [files, filesLoading, addLocalFile, deleteLocalFile] = useTaskFiles(taskId);

    const selectTab = useCallback((fileName) => {
        setCurrentTab(fileName);
    }, []);

    const addFile = useCallback(() => {
        const fileName = window.prompt('Enter file name:');
        if (!fileName) return;

        addLocalFile(fileName);
        setCurrentTab(fileName);
    }, [files]);

    const deleteFile = useCallback((fileName: string) => {
        deleteLocalFile(fileName);
        setCurrentTab('index.py');
        deleteRemoteFile(taskId, fileName);
    }, [files, taskId]);

    return (
        <div className={editor.editor}>
            <div className={editor.interactive}>
                {!filesLoading &&
                    <Files
                        files={files}
                        onTabSelect={selectTab}
                        selectedFile={currentTab}
                        onNewFile={addFile}
                        onFileDelete={deleteFile}
                    />
                }

                {filesLoading &&
                    <div className={editor.filesLoading} />
                }

                <FileEditor
                    taskId={taskId}
                    fileName={currentTab}
                />

                <Console taskId={taskId} />
            </div>

            <div className={editor.briefing}>
                <Briefing taskId={taskId} />
            </div>
        </div>
    )
}
