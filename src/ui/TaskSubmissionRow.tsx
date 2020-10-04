import React, { ReactElement, useCallback, useMemo } from 'react';
import { TableCell } from '@material-ui/core';
import {
    Classroom,
    isSubmissionTask,
    SubmissionTask,
    Task,
    TaskStatus,
    TaskType,
} from '../helpers/types';
import DropdownMenu from './DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import { useAuth } from '../helpers/auth';
import { Shimmer } from 'react-shimmer';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons/faCommentDots';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import moment from 'moment';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { useTasks } from '../helpers/taskData';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import loader from '../styles/loader.module.scss';
import axios from 'axios';

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
                tasks: classroom.tasks.concat(taskDoc.id)
            });

        await axios.post(
            process.env.REACT_APP_API + '/clone',
            {
                projectId: taskDoc.id,
                sourceProjectId: task.id,
            }
        );

        history.push(`/task/${taskDoc.id}`);
    }, [task, classroom, user]);

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
                        submission ? (
                            submission.status === TaskStatus.HasFeedback
                                ? (
                                    <>
                                        <FontAwesomeIcon icon={faCommentDots}/> Returned
                                    </>
                                ) : submission.status === TaskStatus.Submitted ? (
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
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
