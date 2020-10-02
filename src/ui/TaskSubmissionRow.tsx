import React, { ReactElement } from 'react';
import { TableCell } from '@material-ui/core';
import { Classroom, Task, TaskStatus, TaskType } from '../helpers/types';
import DropdownMenu from './DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import TableRow from '@material-ui/core/TableRow';
import { useAuth } from '../helpers/auth';
import { Shimmer } from 'react-shimmer';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons/faCommentDots';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';

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
    const submission = classroom.tasks.filter(task =>
        task.taskType === TaskType.Submission
        && task.parentTask === task.id
        && task.createdBy === user?.uid,
    )[0];

    return (
        <TableRow>
            <TableCell>
                {
                    task.name
                }
            </TableCell>
            <TableCell align='right'>
                {
                    user ? (
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
                            width={80}
                            className='shimmer'
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
                    {/*TODO: add URL here*/}
                    <Link to='/'>
                        <MenuItem>
                            <FontAwesomeIcon icon={faEdit}/>
                            &nbsp;Edit submission
                        </MenuItem>
                    </Link>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
