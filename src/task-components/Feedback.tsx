import { isSubmissionTask, Task } from '../helpers/types';
import React, { FormEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import form from '../styles/form.module.scss';
import editor from '../styles/editor.module.scss';
import loader from '../styles/loader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useSnackbar } from 'notistack';
import TaskStatusIndicator from '../ui/TaskStatus';
import VoiceFeedbackUpload from './VoiceFeedbackUpload';
import { completeTaskFeedback } from '../helpers/taskFeedback';
import { useUser } from '../helpers/auth';
import { Shimmer } from 'react-shimmer';

export default function Feedback(
    {
        taskId,
        task,
    }: {
        taskId: string,
        task: Task | null,
    }
): ReactElement {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [user, userLoading] = useUser(task?.createdBy);

    useEffect(() => {
        if (task && isSubmissionTask(task) && task.feedback) {
            setFeedback(task.feedback);
        }
    }, [task]);

    const {enqueueSnackbar} = useSnackbar();
    const saveFeedback = useCallback((e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        firebase.firestore()
            .collection('tasks')
            .doc(taskId)
            .update({
                feedback,
            })
            .then(() => {
                setLoading(false);
                enqueueSnackbar(
                    'Feedback saved!',
                    {
                        variant: 'success',
                        preventDuplicate: true,
                    }
                );
                completeTaskFeedback(taskId);
            })
            .catch(() => {
                setLoading(false);
                enqueueSnackbar(
                    'Something went wrong. Please try again.',
                    {
                        variant: 'error',
                        preventDuplicate: true,
                    }
                );
            });
    }, [feedback, taskId]);

    return (
        <>
            <form
                className={form.form}
                onSubmit={saveFeedback}
            >
                <h1 className={editor.feedbackHeader}>
                    Feedback
                </h1>

                {
                    userLoading && (
                        <Shimmer
                            className={loader.grayShimmer}
                            height={10}
                            width={100}
                        />
                    )
                }

                {
                    !userLoading && user && (
                        <p
                            className={editor.feedbackMetadata}
                        >
                            Created by: <strong>{user.displayName}</strong>
                        </p>
                    )
                }

                <p
                    className={editor.feedbackMetadata}
                >
                    {!!task && isSubmissionTask(task) && (
                        <TaskStatusIndicator
                            task={task}
                        />
                    )}
                </p>

                <textarea
                    className={`${form.textInput} ${editor.feedbackTextarea}`}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                />

                <button
                    type='submit'
                    disabled={loading}
                    className={form.button}
                >
                    {loading ? (
                        <Loader
                            type='Oval'
                            width={14}
                            height={14}
                            color='white'
                        />
                    ) : <>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Save
                    </>}
                </button>
            </form>

            <VoiceFeedbackUpload
                taskId={taskId}
            />
        </>
    )
}
