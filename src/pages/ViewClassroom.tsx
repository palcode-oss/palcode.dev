import React, { ReactElement, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TaskSubmissionRow from '../components/TaskSubmissionRow';
import { TemplateTask } from '../types';
import { orderBy } from 'lodash';
import { useClassroom } from '../helpers/classroom';
import table from '../styles/table.module.scss';
import { useClassroomTasks } from '../helpers/taskData';
import Spinner from '../ui/Spinner';
import { ProjectType } from 'palcode-types';

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

    const [tasksData, tasksLoading] = useClassroomTasks(classroom?.id, true);

    if (!classroom || tasksLoading) {
        return (
            <Spinner />
        );
    }

    const tasks = tasksData.filter(task => task.type === ProjectType.Template) as TemplateTask[];

    return (
        <div className={table.tablePage}>
            <h1
                className={table.header}
            >
                {
                    classroom.name
                }
            </h1>
            <TableContainer className={table.tableContainer}>
                <Toolbar className={table.toolbar}>
                    <Typography
                        variant='h6'
                        component='div'
                    >
                        Tasks
                    </Typography>
                </Toolbar>
                <Table>
                    {
                        !tasks.length && (
                            <caption>
                                No tasks to show yet. They'll appear here once your teacher creates one.
                            </caption>
                        )
                    }
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
                            orderBy<TemplateTask>(
                                tasks,
                                [(
                                    sort === Column.Status
                                        ? 'status'
                                        : (
                                            sort === Column.Created
                                                ? 'created'
                                                : 'name'
                                        )
                                ), 'created'],
                                [sortDirection === SortDirection.Asc ? 'asc' : 'desc', 'desc']
                            )

                                .map((task) => (
                                    <TaskSubmissionRow
                                        task={task}
                                        classroom={classroom}
                                        key={task.id}
                                    />
                                ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
