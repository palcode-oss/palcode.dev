import React, { FormEvent, useCallback, useMemo } from 'react';
import { isSubmissionTask, Task, TaskStatus } from '../helpers/types';
import form from '../styles/form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEject, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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

        return task.status;
    }, [task]);

    const onButtonPress = useCallback((e: FormEvent) => {
        e.preventDefault();
    }, []);

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
                        &nbsp;Submit task
                    </>
                }
                {
                    [TaskStatus.Submitted, TaskStatus.HasFeedback].includes(submissionStatus) && <>
                        <FontAwesomeIcon icon={faEject} />
                        &nbsp;Unsubmit
                    </>
                }
            </button>
        </form>
    );
}
