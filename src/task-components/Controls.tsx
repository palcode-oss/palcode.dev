import React, { FormEvent, useCallback, useMemo } from 'react';
import { isSubmissionTask, Task, TaskStatus } from '../helpers/types';
import form from '../styles/form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEject, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default function Controls(
    {
        taskId,
        task,
    }: {
        taskId: string,
        task: Task | null,
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

    if (submissionStatus === null) {
        return null;
    }

    return (
        <form
            className={form.form}
            onSubmit={onButtonPress}
        >
            <button
                className={form.button}
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
    );
}
