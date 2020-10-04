import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteRemoteFile, useTaskFiles } from './helpers/taskContent';
import Files from './task-components/Files';
import FileEditor from './task-components/FileEditor';
import Console from './task-components/Console';
import editor from './styles/editor.module.scss';
import Briefing from './task-components/Briefing';
import Controls from './task-components/Controls';
import { useTask } from './helpers/taskData';
import Feedback from './task-components/Feedback';
import { TaskType } from './helpers/types';
import { useSnackbar } from 'notistack';
import { useAuth } from './helpers/auth';

interface Params {
    taskId: string;
}

export default function Task(
    {
        teacherView,
    }: {
        teacherView?: boolean,
    }
): ReactElement {
    const { taskId } = useParams<Params>();
    const [task, taskLoading] = useTask(taskId);
    const [,, user] = useAuth();
    const {enqueueSnackbar} = useSnackbar();

    const [currentTab, setCurrentTab] = useState('index.py');
    const [files, filesLoading, addLocalFile, deleteLocalFile] = useTaskFiles(taskId, );

    const selectTab = useCallback((fileName) => {
        setCurrentTab(fileName);
    }, []);

    const addFile = useCallback(() => {
        const fileName = window.prompt('Enter file name:');
        if (!fileName) return;

        if (fileName === 'README.md') {
            enqueueSnackbar(
                'You can\'t edit README.md because it\'s a reserved file name.',
                {
                    variant: 'error',
                }
            );
            return;
        }

        addLocalFile(fileName);
        setCurrentTab(fileName);
    }, [files]);

    const deleteFile = useCallback((fileName: string) => {
        deleteLocalFile(fileName);
        setCurrentTab('index.py');
        deleteRemoteFile(taskId, fileName);
    }, [files, taskId]);

    const readOnly = useMemo<boolean>(() => {
        if (!task || !user) return true;

        if (teacherView) {
            return true;
        }

        if (task.type === TaskType.Template) {
            return user.perms === 0;
        }

        return false;
    }, [task, teacherView, user]);

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
                        readOnly={readOnly}
                        showReadme={task?.type === TaskType.Template}
                    />
                }

                {filesLoading &&
                    <div className={editor.filesLoading} />
                }

                <FileEditor
                    taskId={taskId}
                    fileName={currentTab}
                    readOnly={readOnly}
                />

                <Console taskId={taskId} />
            </div>

            <div className={editor.sidebar}>
                {
                    !teacherView && <>
                        <Controls
                            task={task}
                            taskId={taskId}
                        />
                        <Briefing
                            taskId={taskId}
                            task={task}
                            taskLoading={taskLoading}
                        />
                    </>
                }
                {
                    teacherView && <Feedback
                        taskId={taskId}
                        task={task}
                    />
                }
            </div>
        </div>
    )
}
