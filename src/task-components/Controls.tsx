import React, { FormEvent, useCallback, useMemo } from 'react';
import { isSubmissionTask, Task, TaskStatus } from '../helpers/types';
import form from '../styles/form.module.scss';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEject, faPaperPlane, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { availableThemes } from '../helpers/monaco-themes';

export default function Controls(
    {
        taskId,
        task,
        onClosePress,
        themeDisplayName,
        onThemeChange,
    }: {
        taskId: string,
        task: Task | null,
        onClosePress(): void,
        themeDisplayName: string,
        onThemeChange(themeDisplayName: string): void,
    }
) {
    const submissionStatus = useMemo<TaskStatus | null>(() => {
        if (!task || !isSubmissionTask(task)) {
            return null;
        }

        if (!Number.isInteger(task.status)) {
            return TaskStatus.Unsubmitted;
        }

        return task.status;
    }, [task]);

    const onButtonPress = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const targetSubmissionStatus: TaskStatus = submissionStatus === TaskStatus.Unsubmitted
            ? TaskStatus.Submitted :
            TaskStatus.Unsubmitted;

        const taskDoc = firebase.firestore()
            .collection('tasks')
            .doc(taskId)

        await taskDoc
            .update({
                status: targetSubmissionStatus,
            });

        await taskDoc
            .collection('statusUpdates')
            .add({
                status: targetSubmissionStatus,
                createdAt: firebase.firestore.Timestamp.now(),
            });
    }, [submissionStatus, taskId]);

    const CloseBriefing = useMemo(() => () => {
        return (
            <button
                className={form.button}
                type='button'
                onClick={onClosePress}
            >
                <FontAwesomeIcon icon={faTimesCircle} />
                Close briefing
            </button>
        );
    }, [onClosePress]);

    if (submissionStatus === null) {
        return (
            <form
                className={form.form}
                onSubmit={() => {}}
            >
                <CloseBriefing />
            </form>
        );
    }

    return <>
        <form
            className={form.form}
            onSubmit={onButtonPress}
        >
            <CloseBriefing />

            <button
                className={form.button}
                type='submit'
            >
                {
                    submissionStatus === TaskStatus.Unsubmitted && <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Submit task
                    </>
                }
                {
                    [TaskStatus.Submitted, TaskStatus.HasFeedback].includes(submissionStatus) && <>
                        <FontAwesomeIcon icon={faEject} />
                        Unsubmit
                    </>
                }
            </button>
        </form>

        <select
            value={themeDisplayName}
            onChange={(e) => onThemeChange(e.target.value)}
            className={editor.themeSelector}
        >
            {availableThemes.map(themePair => (
                <option
                    key={themePair.normalisedName}
                    value={themePair.displayName}
                >
                    {themePair.displayName}
                </option>
            ))}
        </select>
    </>;
}
