import React, { ReactElement } from 'react';
import { TableCell } from '@material-ui/core';
import moment from 'moment';
import DropdownMenu from './DropdownMenu';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import TableRow from '@material-ui/core/TableRow';
import { Classroom, isTemplateTask } from '../helpers/types';
import { useTasks } from '../helpers/taskData';
import studentDashboard from '../styles/studentDashboard.module.scss';
import { Shimmer } from 'react-shimmer';

interface Props {
    classroom: Classroom;
    handleDelete: (id: string) => void;
}

export default function ClassroomRow(
    {
        classroom,
        handleDelete,
    }: Props
): ReactElement {
    const [tasks, tasksLoading] = useTasks(classroom.tasks);

    return (
        <TableRow>
            <TableCell>{classroom.name}</TableCell>
            <TableCell align='right'>{classroom.members.length}</TableCell>
            <TableCell align='right'>
                {
                    tasksLoading ? (
                        <Shimmer
                            height={12}
                            width={40}
                            className={studentDashboard.shimmer}
                        />
                    ) : (
                        tasks
                            .filter(task => isTemplateTask(task))
                            .length
                    )
                }
            </TableCell>
            <TableCell align='right'>
                {
                    moment(classroom.created.toDate()).fromNow()
                }
            </TableCell>
            <TableCell align='center'>
                <DropdownMenu>
                    <Link to={`/classroom/${classroom.id}/view_code`}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faKeyboard}/>
                            &nbsp;View code page
                        </MenuItem>
                    </Link>
                    <Link to={`/classroom/${classroom.id}/manage`}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faEdit}/>
                            &nbsp;Manage classroom
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={() => handleDelete(classroom.id)}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                        &nbsp;Delete
                    </MenuItem>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
