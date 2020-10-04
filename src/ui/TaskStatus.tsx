import { SubmissionTask, Task, TaskStatus } from '../helpers/types';
import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons/faCommentDots';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';

interface Props {
    task?: SubmissionTask
}

export default function TaskStatusIndicator(
    {
        task
    }: Props
): ReactElement {
    return task ? (
        task.status === TaskStatus.HasFeedback
            ? (
                <>
                    <FontAwesomeIcon icon={faCommentDots}/> Returned
                </>
            ) : task.status === TaskStatus.Submitted ? (
                <>
                    <FontAwesomeIcon icon={faPaperPlane}/> Submitted
                </>
            ) : (
                <>
                    <FontAwesomeIcon icon={faEye}/> Opened
                </>
            )

    ) : (
        <>
            <FontAwesomeIcon icon={faEyeSlash}/> Not opened
        </>
    )
}
