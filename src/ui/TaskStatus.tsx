import { SubmissionTask, Task, TaskStatus } from '../helpers/types';
import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons/faCommentDots';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';

interface Props {
    task?: SubmissionTask | null
}

export default function TaskStatusIndicator(
    {
        task
    }: Props
): ReactElement {
    return task ? (
        task.status === TaskStatus.HasFeedback
            ? (
                <span style={{
                        color: '#474747'
                }}>
                    <FontAwesomeIcon icon={faCommentDots}/> Returned
                </span>
            ) : task.status === TaskStatus.Submitted ? (
                <span style={{
                        color: '#1f7a22'
                }}>
                    <FontAwesomeIcon icon={faPaperPlane}/> Submitted
                </span>
            ) : (
                <span style={{
                        color: '#0e488a'
                }}>
                    <FontAwesomeIcon icon={faEye}/> Opened
                </span>
            )

    ) : (
        <span style={{
               color: '#8a0e0e'
        }}>
            <FontAwesomeIcon icon={faEyeSlash}/> Not opened
        </span>
    )
}
