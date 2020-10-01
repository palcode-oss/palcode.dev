import React, { ReactElement } from "react";
import { useParams } from 'react-router-dom';
import useTask from './helpers/taskData';
import MonacoEditor from 'react-monaco-editor/lib/editor';

interface Params {
    taskId: string;
}

export default function Task(): ReactElement {
    const { taskId } = useParams<Params>();
    const [task, taskLoading] = useTask(taskId);

    return (
        <div className='task'>
            <MonacoEditor
                width='800'
                height='600'
                language='python'
                theme='vs-dark'
            />
        </div>
    )
}
