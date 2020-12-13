import React, { ReactElement, useCallback, useState } from 'react';
import { TableCell } from '@material-ui/core';
import moment from 'moment';
import DropdownMenu from './DropdownMenu';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import TableRow from '@material-ui/core/TableRow';
import { Classroom, isTemplateTask } from '../types';
import { useTasks } from '../helpers/taskData';
import studentDashboard from '../styles/studentDashboard.module.scss';
import { Shimmer } from 'react-shimmer';
import { faClone } from '@fortawesome/free-solid-svg-icons';

interface Props {
    classroom: Classroom;
    handleDelete(classroomId: string): void;
    openCloneModal(classroomId: string): void;
}

export default function ClassroomRow(
    {
        classroom,
        handleDelete,
        openCloneModal,
    }: Props
): ReactElement {
    const [tasks, tasksLoading] = useTasks(classroom.id);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const onCloneClick = useCallback(() => {
        setDropdownOpen(false);
        openCloneModal(classroom.id);
    }, [openCloneModal, classroom]);

    return <>
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
                <DropdownMenu
                    open={dropdownOpen}
                    onChange={setDropdownOpen}
                >
                    <Link to={`/classroom/${classroom.id}/manage`}>
                        <MenuItem>
                            <FontAwesomeIcon icon={faEdit}/>
                            &nbsp;Manage classroom
                        </MenuItem>
                    </Link>
                    <MenuItem
                        title='Clone the classroom and all of its tasks. Does not clone members and submissions.'
                        onClick={onCloneClick}
                    >
                        <FontAwesomeIcon icon={faClone} />
                        &nbsp;Clone
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleDelete(classroom.id)}
                        title='Delete the classroom, its tasks, and all task submissions permanently.'
                    >
                        <FontAwesomeIcon icon={faTrashAlt}/>
                        &nbsp;Delete
                    </MenuItem>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    </>;
}
