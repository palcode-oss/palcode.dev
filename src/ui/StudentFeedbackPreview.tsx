import modal from '../styles/modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import form from '../styles/form.module.scss';
import React from 'react';
import { SubmissionTask } from '../helpers/types';
import VoiceFeedbackPreview from '../task-components/VoiceFeedbackPreview';

export default function StudentFeedbackPreview(
    {
        showFeedback,
        submission,
        onClose,
    }: {
        showFeedback: boolean,
        submission: SubmissionTask,
        onClose(): void,
    }
) {
    if (!showFeedback || !submission.feedback) {
        return null;
    }

    return (
        <div className={modal.modal}>
            <div className={modal.content}>
                <div className={modal.head}>
                                <span className={modal.title}>
                                    Feedback for {submission.name}
                                </span>

                    <button
                        className={modal.close}
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </button>
                </div>

                <div className={modal.body}>
                    <strong>
                        Feedback from your teacher:
                    </strong>

                    <p className={modal.feedback}>
                        {
                            submission.feedback
                        }
                    </p>

                    <VoiceFeedbackPreview
                        taskId={submission.id}
                    />

                    <button
                        className={form.button}
                        onClick={onClose}
                        style={{
                            float: 'right',
                            margin: 10,
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
