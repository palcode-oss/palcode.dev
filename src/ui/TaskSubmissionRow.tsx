import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { TableCell } from '@material-ui/core';
import { Classroom, isSubmissionTask, SubmissionTask, Task, TaskStatus, TaskType } from '../helpers/types';
import DropdownMenu from './DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import { useAuth } from '../helpers/auth';
import { Shimmer } from 'react-shimmer';
import moment from 'moment';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { useTasks } from '../helpers/taskData';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import loader from '../styles/loader.module.scss';
import axios from 'axios';
import TaskStatusIndicator from './TaskStatus';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import modal from '../styles/modal.module.scss';
import form from '../styles/form.module.scss';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

interface Props {
    task: Task;
    classroom: Classroom;
}

export default function TaskSubmissionRow(
    {
        task,
        classroom,
    }: Props,
): ReactElement {
    const [user] = useAuth();
    const [tasks, tasksLoading] = useTasks(classroom.tasks);
    const submission = useMemo<SubmissionTask>(() => {
        return tasks.filter(newTask =>
            isSubmissionTask(newTask)
            && newTask.parentTask === task.id
            && newTask.createdBy === user?.uid,
        )[0] as SubmissionTask;
    }, [tasks, user]);

    const history = useHistory();
    const openSubmission = useCallback(async () => {
        if (!user) return;

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

        const taskDoc = firebase
            .firestore()
            .collection('tasks')
            .doc();

        await taskDoc
            .set({
                createdBy: user.uid,
                name: task.name,
                status: TaskStatus.Unsubmitted,
                type: TaskType.Submission,
                id: taskDoc.id,
                created: firebase.firestore.Timestamp.now(),
                parentTask: task.id,
            } as SubmissionTask);

        await firebase
            .firestore()
            .collection('classrooms')
            .doc(classroom.id)
            .update({
                tasks: classroom.tasks.concat(taskDoc.id),
            });

        await axios.post(
            process.env.REACT_APP_API + '/clone',
            {
                projectId: taskDoc.id,
                sourceProjectId: task.id,
            },
        );

        history.push(`/task/${taskDoc.id}`);
    }, [task, classroom, user]);

    const [showFeedback, setShowFeedback] = useState(false);
    const displayFeedback = useCallback(() => {
        setShowFeedback(true);
    }, []);

    return (
        <TableRow>
            <TableCell>
                {
                    task.name
                }
            </TableCell>
            <TableCell align='right'>
                {
                    user && !tasksLoading ? (
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
                <DropdownMenu>
                    <MenuItem onClick={openSubmission}>
                        <FontAwesomeIcon icon={faEdit}/>
                        &nbsp;Edit submission
                    </MenuItem>
                    {
                        submission?.status === TaskStatus.HasFeedback && (
                            <MenuItem onClick={displayFeedback}>
                                <FontAwesomeIcon icon={faAward}/>
                                &nbsp;View feedback
                            </MenuItem>
                        )
                    }
                </DropdownMenu>
            </TableCell>

            {
                showFeedback && submission.feedback && (
                    <div className={modal.modal}>
                        <div className={modal.content}>
                            <div className={modal.head}>
                                <span className={modal.title}>
                                    Feedback for {submission.name}
                                </span>

                                <button
                                    className={modal.close}
                                    onClick={() => setShowFeedback(false)}
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

                                <button
                                    className={form.button}
                                    onClick={() => setShowFeedback(false)}
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
                )
            }
        </TableRow>
    );
}
