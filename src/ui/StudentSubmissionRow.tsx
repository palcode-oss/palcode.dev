import { SubmissionTask } from '../helpers/types';
import { TableCell } from '@material-ui/core';
import { Shimmer } from 'react-shimmer';
import moment from 'moment';
import DropdownMenu from './DropdownMenu';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { useUser } from '../helpers/auth';
import TaskStatusIndicator from './TaskStatus';

interface Props {
    task: SubmissionTask;
}

export default function StudentSubmissionRow(
    {
        task,
    }: Props,
) {
    const [creator, creatorLoading] = useUser(task.createdBy);

    return (
        <TableRow>
            <TableCell>
                {
                    creatorLoading || !creator ? (
                        <Shimmer
                            height={12}
                            width={120}
                            className='shimmer'
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
