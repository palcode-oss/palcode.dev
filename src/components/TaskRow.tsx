import React, { ReactElement, useCallback, useMemo } from 'react';
import { Classroom, isSubmissionTask, SubmissionTask, TemplateTask } from '../types';
import { TableCell } from '@material-ui/core';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import TableRow from '@material-ui/core/TableRow';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useSnackbar } from 'notistack';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import TaskLanguageIcon from '../ui/TaskLanguageIcon';
import { ProjectStatus } from 'palcode-types';

interface Props {
    task: TemplateTask;
    tasks: (TemplateTask | SubmissionTask)[];
    classroomId: string;
    setClassroomUpdater: (updater: number) => void;
    classroom: Classroom;
}

export default function TaskRow(
    {
        task,
        tasks,
        classroom,
        classroomId,
        setClassroomUpdater,
    }: Props,
): ReactElement {
    const {enqueueSnackbar} = useSnackbar();
    const deleteTask = useCallback(() => {
        const confirmed = window.confirm(`Are you sure you want to delete "${task.name}"? 
This action is irreversible, and will also delete any submissions.`,);
        if (!confirmed) return;

        const batch = firebase.firestore().batch();
        batch.delete(firebase.firestore().collection('tasks').doc(task.id));

        const submissions = tasks.filter(e => isSubmissionTask(e) && e.parentTask === task.id);
        submissions.forEach(submission => {
            batch.delete(
                firebase.firestore()
                    .collection('tasks')
                    .doc(submission.id),
            );
        });

        batch.commit()
            .then(() => {
                enqueueSnackbar('Task & submissions removed successfully!', {
                    variant: 'success',
                });
                setClassroomUpdater(Math.random());
            });
    }, [classroomId, classroom, tasks, task]);

    const groupedSubmissions = useMemo<[number, number, number]>(() => {
        return [ProjectStatus.Unsubmitted, ProjectStatus.Submitted, ProjectStatus.HasFeedback].map(status => {
            return tasks
                .filter(e => {
                    return isSubmissionTask(e) && e.parentTask === task.id && e.status === status;
                })
                .length;
        }) as [number, number, number];
    }, [tasks, task]);

    const reviewLink = useMemo(() => {
        return `/task/${task.id}/review`;
    }, [task]);

    return (
        <TableRow>
            <TableCell>
                <TaskLanguageIcon language={task.language} />
                <Link to={reviewLink}>
                    {task.name}
                </Link>
            </TableCell>
            <TableCell align='right'>
                {moment(task.created.toDate()).fromNow()}
            </TableCell>
            {
                groupedSubmissions.map((submissionCount, index) => (
                    <TableCell
                        align='right'
                        key={index}
                    >
                        {submissionCount}
                    </TableCell>
                ))
            }
            <TableCell align='center'>
                <DropdownMenu>
                    <Link to={reviewLink}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faGraduationCap}/>
                            &nbsp;Review
                        </MenuItem>
                    </Link>
                    <Link to={`/task/${task.id}`}>
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
