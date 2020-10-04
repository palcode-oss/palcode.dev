import { SubmissionTask, TaskStatus } from '../helpers/types';
import { TableCell } from '@material-ui/core';
import { Shimmer } from 'react-shimmer';
import moment from 'moment';
import DropdownMenu from './DropdownMenu';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useUser } from '../helpers/auth';
import TaskStatusIndicator from './TaskStatus';
import firebase from 'firebase/app';
import 'firebase/firestore';
import loader from '../styles/loader.module.scss';

interface Props {
    task: SubmissionTask;
}

export default function StudentSubmissionRow(
    {
        task,
    }: Props,
) {
    const [creator, creatorLoading] = useUser(task.createdBy);
    const [taskSubmissionTime, setTaskSubmissionTime] = useState<null | firebase.firestore.Timestamp>(null);
    useEffect(() => {
        if (task.status === TaskStatus.Unsubmitted) return;

        firebase
            .firestore()
            .collection('tasks')
            .doc(task.id)
            .collection('statusUpdates')
            .where('status', '==', TaskStatus.Submitted)
            .orderBy('createdAt', 'desc')
            .get()
            .then(data => {
                if (!data.empty) {
                    setTaskSubmissionTime(data.docs[0].data().createdAt as firebase.firestore.Timestamp);
                }
            });
    }, [task]);


    return (
        <TableRow>
            <TableCell>
                {
                    creatorLoading || !creator ? (
                        <Shimmer
                            height={12}
                            width={120}
                            className={loader.grayShimmer}
                        />
                    ) : (
                        creator.displayName
                    )
                }
            </TableCell>
            <TableCell align='right'>
                <TaskStatusIndicator task={task}/>
            </TableCell>
            <TableCell align='right'>
                {
                    moment(task.created.toDate()).fromNow()
                }
            </TableCell>
            <TableCell align='right'>
                {
                    task.status !== TaskStatus.Unsubmitted ? (
                        taskSubmissionTime ? (
                            moment(taskSubmissionTime.toDate()).fromNow()
                        ) : (
                            <Shimmer
                                height={12}
                                width={100}
                                className={loader.grayShimmer}
                            />
                        )
                    ) : (
                        <>
                            &mdash;
                        </>
                    )
                }
            </TableCell>
            <TableCell align='center'>
                <DropdownMenu>
                    <Link to={`/task/${task.id}/feedback`}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faGraduationCap}/>
                            &nbsp;Review submission
                        </MenuItem>
                    </Link>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
