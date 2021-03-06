import { SubmissionTask } from '../types';
import { TableCell } from '@material-ui/core';
import { Shimmer } from 'react-shimmer';
import moment from 'moment';
import { Link } from 'react-router-dom';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useUser } from '../helpers/auth';
import TaskStatusIndicator from '../ui/TaskStatus';
import firebase from 'firebase/app';
import 'firebase/firestore';
import loader from '../styles/loader.module.scss';
import table from '../styles/table.module.scss';
import { ProjectStatus } from 'palcode-types';

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
        if (task.status === ProjectStatus.Unsubmitted) return;

        firebase
            .firestore()
            .collection('tasks')
            .doc(task.id)
            .collection('statusUpdates')
            .where('status', '==', ProjectStatus.Submitted)
            .orderBy('createdAt', 'desc')
            .get()
            .then(data => {
                if (!data.empty) {
                    setTaskSubmissionTime(data.docs[0].data().createdAt as firebase.firestore.Timestamp);
                }
            });
    }, [task]);


    return (
        <TableRow
            component={Link}
            to={`/task/${task.id}/feedback`}
            className={table.link}
        >
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
                    task.status !== ProjectStatus.Unsubmitted ? (
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
        </TableRow>
    );
}
