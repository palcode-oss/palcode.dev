import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { TableCell } from '@material-ui/core';
import { Classroom, SubmissionTask, TemplateTask } from '../types';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import { useAuth } from '../helpers/auth';
import { Shimmer } from 'react-shimmer';
import moment from 'moment';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import loader from '../styles/loader.module.scss';
import axios from 'axios';
import TaskStatusIndicator from '../ui/TaskStatus';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import StudentFeedbackPreview from './StudentFeedbackPreview';
import { useSnackbar } from 'notistack';
import form from '../styles/form.module.scss';
import getEnvVariable from '../helpers/getEnv';
import TaskLanguageIcon from '../ui/TaskLanguageIcon';
import { useSchoolId } from '../helpers/school';
import useAPIToken from '../helpers/apiToken';
import { ProjectStatus, ProjectType } from 'palcode-types';

interface Props {
    task: TemplateTask;
    classroom: Classroom;
}

export default function TaskSubmissionRow(
    {
        task,
        classroom,
    }: Props,
): ReactElement {
    const [user] = useAuth();
    const [submission, setSubmission] = useState<SubmissionTask | undefined>(undefined);
    useEffect(() => {
        if (!task || !user) return;

        firebase.firestore()
            .collection('tasks')
            .where('parentTask', '==', task.id)
            .where('createdBy', '==', user.uid)
            .get()
            .then(response => {
                if (!response.empty) {
                    const document = response.docs[0];

                    setSubmission({
                        ...document.data() as SubmissionTask,
                        id: document.id,
                    });
                }
            });
    }, [task, user]);

    const history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const schoolId = useSchoolId();
    const token = useAPIToken();
    const openSubmission = useCallback(async () => {
        if (!user || !classroom || !schoolId || !token) return;

        const existingTaskResponse = await firebase
            .firestore()
            .collection('tasks')
            .where('createdBy', '==', user.uid)
            .where('parentTask', '==', task.id)
            .get();

        if (!existingTaskResponse.empty) {
            history.push(`/task/${existingTaskResponse.docs[0].id}`);
            return;
        }

        enqueueSnackbar('Cloning task...', {
            variant: 'info',
            key: 'task-clone'
        });

        const taskDoc = firebase
            .firestore()
            .collection('tasks')
            .doc();

        await taskDoc
            .set({
                ...task,
                createdBy: user.uid,
                status: ProjectStatus.Unsubmitted,
                type: ProjectType.Submission,
                created: firebase.firestore.Timestamp.now(),
                parentTask: task.id,
            } as SubmissionTask);

        await axios.post(
            getEnvVariable('API') + '/clone',
            {
                projectId: taskDoc.id,
                sourceProjectId: task.id,
                schoolId,
                token,
            },
        );

        closeSnackbar('task-clone');
        history.push(`/task/${taskDoc.id}`);
    }, [task, classroom, user, schoolId, token]);

    const [showFeedback, setShowFeedback] = useState(false);
    const displayFeedback = useCallback(() => {
        setShowFeedback(true);
    }, []);

    return (
        <TableRow>
            <TableCell>
                <TaskLanguageIcon language={task.language} />
                {
                    task.name
                }
            </TableCell>
            <TableCell align='right'>
                {
                    user ? (
                        <TaskStatusIndicator task={submission}/>
                    ) : (
                        <Shimmer
                            height={12}
                            width={90}
                            className={loader.grayShimmer}
                        />
                    )
                }
            </TableCell>
            <TableCell align='right'>
                {
                    moment(task.created.toDate()).fromNow()
                }
            </TableCell>
            <TableCell align='center'>
                {
                    submission?.status !== ProjectStatus.HasFeedback && (
                        <button
                            className={form.button}
                            onClick={openSubmission}
                        >
                            <FontAwesomeIcon icon={faEdit}/>
                            Open
                        </button>
                    )
                }

                {
                    submission?.status === ProjectStatus.HasFeedback && (
                        <DropdownMenu>
                            <MenuItem onClick={openSubmission}>
                                <FontAwesomeIcon icon={faEdit}/>
                                &nbsp;Open
                            </MenuItem>
                            {
                                submission?.status === ProjectStatus.HasFeedback && (
                                    <MenuItem onClick={displayFeedback}>
                                        <FontAwesomeIcon icon={faAward}/>
                                        &nbsp;View feedback
                                    </MenuItem>
                                )
                            }
                        </DropdownMenu>
                    )
                }
            </TableCell>

            <StudentFeedbackPreview
                showFeedback={showFeedback}
                submission={submission}
                onClose={() => setShowFeedback(false)}
            />
        </TableRow>
    );
}
