import React, { ReactElement, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClassroom } from './ManageClassroom';
import Loader from 'react-loader-spinner';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TaskSubmissionRow from './ui/TaskSubmissionRow';
import * as _ from 'lodash';
import { Task, TaskType } from './helpers/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

interface Params {
    classroomId: string;
}

enum Column {
    Name,
    Status,
    Created,
}

enum SortDirection {
    Asc,
    Desc,
}

export default function ViewClassroom(): ReactElement {
    const {classroomId} = useParams<Params>();
    const classroom = useClassroom(classroomId);

    const [sort, setSort] = useState(Column.Status);
    const [sortDirection, setSortDirection] = useState(SortDirection.Asc);

    const handleSortClick = useCallback((column: Column) => {
        if (sort === column) {
            setSortDirection(sortDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc);
        } else {
            setSortDirection(SortDirection.Asc);
            setSort(column);
        }
    }, [sort, sortDirection]);

    if (!classroom) {
        return (
            <Loader
                type='Oval'
                width={120}
                height={120}
                color='blue'
            />
        );
    }

    const tasks = classroom.tasks.filter(task => task.type === TaskType.Template);

    return (
        <div className='view-classroom'>
            <h1>
                {
                    classroom.name
                }
            </h1>
            <TableContainer>
                <Toolbar>
                    <Typography
                        variant='h6'
                        component='div'
                    >
                        Tasks
                    </Typography>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sort === Column.Name}
                                    direction={sortDirection === SortDirection.Asc ? 'asc' : 'desc'}
                                    onClick={() => handleSortClick(Column.Name)}
                                >
                                    Task name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='right'>
                                <TableSortLabel
                                    active={sort === Column.Status}
                                    direction={sortDirection === SortDirection.Asc ? 'asc' : 'desc'}
                                    onClick={() => handleSortClick(Column.Status)}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='right'>
                                <TableSortLabel
                                    active={sort === Column.Created}
                                    direction={sortDirection === SortDirection.Asc ? 'asc' : 'desc'}
                                    onClick={() => handleSortClick(Column.Created)}
                                >
                                    Created
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            _.sortBy<Task>(
                                tasks,
                                (
                                    sort === Column.Status
                                        ? 'status'
                                        : (
                                            sort === Column.Created
                                                ? 'created'
                                                : 'name'
                                        )
                                ),
                            )
                                .map((task) => (
                                    <TaskSubmissionRow
                                        task={task}
                                        classroom={classroom}
                                    />
                                ))
                        }
                        {
                            !tasks.length && (
                                <p>
                                    No tasks to show yet. They'll appear here once your teacher creates one.
                                </p>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
