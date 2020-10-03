import React, { ReactElement, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTask from './helpers/taskData';
import { useTaskFiles } from './helpers/taskContent';
import Files from './task-components/Files';
import FileEditor from './task-components/FileEditor';
import { useSocket } from './helpers/socket';
import Console from './task-components/Console';

interface Params {
    taskId: string;
}

export default function Task(): ReactElement {
    const { taskId } = useParams<Params>();
    const [task, taskLoading] = useTask(taskId);

    const [currentTab, setCurrentTab] = useState('index.py');
    const [files, filesLoading] = useTaskFiles(taskId, currentTab);

    const selectTab = useCallback((fileName) => {
        setCurrentTab(fileName);
    }, []);

    const socket = useSocket();

    return (
        <div className='task'>
            <Files
                files={files}
                onTabSelect={selectTab}
            />

            <FileEditor
                taskId={taskId}
                fileName={currentTab}
            />

            <Console taskId={taskId} />
        </div>
    )
}
