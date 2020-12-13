import React, { lazy, ReactElement, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteRemoteFile, useTaskFiles } from '../helpers/taskContent';
import Files from '../task-components/Files';
import editor from '../styles/editor.module.scss';
import Briefing from '../task-components/Briefing';
import Controls from '../task-components/Controls';
import { useTask } from '../helpers/taskData';
import { isSubmissionTask, TaskStatus, TaskType } from '../types';
import { useSnackbar } from 'notistack';
import { useAuth } from '../helpers/auth';
import Sidebar from '../task-components/Sidebar';
import { availableThemes, ThemeMetadata } from '../helpers/monacoThemes';
import LazyComponentFallback from '../ui/LazyComponentFallback';
import getLanguageDefaultFile from '../helpers/defaultFile';

const FileEditor = lazy(() => import('../task-components/FileEditor'));
const Console = lazy(() => import('../task-components/Console'));
const Feedback = lazy(() => import('../task-components/Feedback'));

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

    const [currentTab, setCurrentTab] = useState<string>();
    const [files, filesLoading, addLocalFile, deleteLocalFile] = useTaskFiles(taskId, task?.language);

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
        deleteRemoteFile(taskId, fileName);

        if (task) {
            setCurrentTab(getLanguageDefaultFile(task.language));
        }
    }, [files, task]);

    const readOnly = useMemo<boolean>(() => {
        if (!task || !user) return true;

        if (teacherView) {
            return true;
        }

        if (task.type === TaskType.Template) {
            return user.perms === 0;
        }

        if (task.type === TaskType.Submission) {
            return task.status !== TaskStatus.Unsubmitted;
        }

        return false;
    }, [task, teacherView, user]);

    const [showPopOver, setShowPopOver] = useState(true);
    useEffect(() => {
        if (task?.type === TaskType.Template) {
            setShowPopOver(false);
        }

        if (task) {
            setCurrentTab(getLanguageDefaultFile(task?.language));
        }
    }, [task]);

    const [theme, setTheme] = useState<ThemeMetadata | undefined>();
    const onThemeChange = useCallback((themeDisplayName: string) => {
        const themePair = availableThemes.find(e => e.displayName === themeDisplayName);
        if (!themePair) return;

        setTheme(themePair);
    }, []);

    useEffect(() => {
        const themeDisplayName = localStorage.getItem('PalCode-Theme');
        if (themeDisplayName) {
            const themePair = availableThemes.find(e => e.displayName === themeDisplayName);
            if (!themePair) {
                localStorage.removeItem('PalCode-Theme');
                setTheme(availableThemes[0]);
                return;
            }

            setTheme(themePair);
        } else {
            setTheme(availableThemes[0]);
        }
    }, []);

    useEffect(() => {
        if (!theme) return;
        localStorage.setItem('PalCode-Theme', theme.displayName);
    }, [theme]);

    return (
        <div className={editor.editor}>
            <div className={`${editor.editorHalf} ${teacherView ? editor.editorHalfFeedback : ''}`}>
                {!filesLoading && currentTab &&
                    <Files
                        files={files}
                        onTabSelect={selectTab}
                        selectedFile={currentTab}
                        onNewFile={addFile}
                        onFileDelete={deleteFile}
                        readOnly={readOnly}
                        showReadme={task?.type !== TaskType.Submission}
                    />
                }

                {filesLoading &&
                    <div className={editor.filesLoading} />
                }

                <Suspense fallback={<LazyComponentFallback />}>
                    {theme && currentTab && (
                        <FileEditor
                            taskId={taskId}
                            fileName={currentTab}
                            readOnly={readOnly}
                            themePair={theme}
                        />
                    )}
                </Suspense>
            </div>

            <div className={`${editor.consoleHalf} ${teacherView ? editor.consoleHalfFeedback : ''}`}>
                <Suspense fallback={<LazyComponentFallback />}>
                    <Console
                        taskId={taskId}
                        taskLanguage={task?.language}
                        themeMetadata={theme}
                    />
                </Suspense>
            </div>

            {
                !teacherView && (
                    <div className={editor.sidebar}>
                        <Sidebar
                            onInfoClick={() => setShowPopOver(!showPopOver)}
                        />
                    </div>
                )
            }

            {
                !teacherView && (
                    <div className={`${editor.popOver} ${(showPopOver) ? editor.popOverActive : ''}`}>
                        {theme && (
                            <Controls
                                task={task}
                                taskId={taskId}
                                onClosePress={() => setShowPopOver(false)}
                                themeDisplayName={theme.displayName}
                                onThemeChange={onThemeChange}
                            />
                        )}

                        <Briefing
                            taskId={taskId}
                            task={task}
                            taskLoading={taskLoading}
                        />
                    </div>
                )
            }

            <Suspense fallback={<LazyComponentFallback />}>
                {
                    teacherView && isSubmissionTask(task) && (
                        <div className={editor.feedbackSection}>
                            <Feedback
                                taskId={taskId}
                                task={task}
                            />
                        </div>
                    )
                }
            </Suspense>
        </div>
    )
}
