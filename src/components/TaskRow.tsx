import React, { ReactElement, useCallback } from 'react';
import { Classroom, isSubmissionTask } from '../types';
import { TableCell } from '@material-ui/core';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import TableRow from '@material-ui/core/TableRow';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useSnackbar } from 'notistack';
import { Shimmer } from 'react-shimmer';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useTask, useTasks } from '../helpers/taskData';
import loader from '../styles/loader.module.scss';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import TaskLanguageIcon from '../ui/TaskLanguageIcon';
import { ProjectStatus } from 'palcode-types';

interface Props {
    taskId: string;
    classroomId: string;
    setClassroomUpdater: (updater: number) => void;
    classroom: Classroom;
}

export default function TaskRow(
    {
        taskId,
        classroom,
        classroomId,
        setClassroomUpdater,
    }: Props,
): ReactElement {
    const [task] = useTask(taskId);

    const [tasks, tasksLoading] = useTasks(classroom.id);

    const {enqueueSnackbar} = useSnackbar();
    const deleteTask = useCallback(() => {
        if (tasksLoading) return;

        Promise.all(
            tasks
                .filter(t => t.id === taskId || (isSubmissionTask(t) && t.parentTask === taskId))
                .map(t =>
                    firebase
                        .firestore()
                        .collection('tasks')
                        .doc(t.id)
                        .delete()
                )
        )
            .then(() => {
                enqueueSnackbar('Task & submissions removed successfully!', {
                    variant: 'success',
                });
                setClassroomUpdater(Math.random());
            })
    }, [classroomId, classroom, taskId, tasks]);

    if (tasksLoading) return <></>;

    return (
        <TableRow>
            <TableCell>
                <TaskLanguageIcon language={task?.language} />
                {
                    task?.name || (
                        <Shimmer
                            height={12}
                            width={80}
                            className={loader.grayShimmer}
                        />
                    )
                }
            </TableCell>
            <TableCell align='right'>
                {
                    task ?
                        moment(task.created.toDate()).fromNow()
                        : (
                            <Shimmer
                                height={12}
                                width={120}
                                className={loader.grayShimmer}
                            />
                        )
                }
            </TableCell>
            {
                [ProjectStatus.Unsubmitted, ProjectStatus.Submitted, ProjectStatus.HasFeedback].map(status => (
                    <TableCell
                        align='right'
                        key={status}
                    >
                        {
                            tasks.reduce(
                                (totalTaskCount, classroomTask) =>
                                    isSubmissionTask(classroomTask)
                                    && classroomTask.parentTask === taskId
                                    && classroomTask.status === status
                                        ? totalTaskCount + 1
                                        : totalTaskCount,
                                0,
                            )
                        }
                    </TableCell>
                ))
            }
            <TableCell align='center'>
                <DropdownMenu>
                    <Link to={`/task/${taskId}/review`}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faGraduationCap}/>
                            &nbsp;Review
                        </MenuItem>
                    </Link>
                    <Link to={`/task/${taskId}`}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faEdit} />
                            &nbsp;Edit template
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={deleteTask}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                        &nbsp;Delete task
                    </MenuItem>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
