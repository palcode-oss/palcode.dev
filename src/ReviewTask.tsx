import React, { ReactElement } from 'react';
import table from './styles/table.module.scss';
import TableContainer from '@material-ui/core/TableContainer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import { useParams } from 'react-router-dom';
import loader from './styles/loader.module.scss';
import Loader from 'react-loader-spinner';
import { useSubmissions, useTask } from './helpers/taskData';
import StudentSubmissionRow from './ui/StudentSubmissionRow';
import { Shimmer } from 'react-shimmer';

interface Params {
    taskId: string;
}

export default function ReviewTask(): ReactElement {
    const {taskId} = useParams<Params>();
    const [submissions, loading] = useSubmissions(taskId);

    const [task, taskLoading] = useTask(taskId);

    if (loading) {
        return (
            <div className={loader.loader}>
                <Loader
                    type='Oval'
                    width={120}
                    height={120}
                    color='blue'
                />
            </div>
        );
    }

    return (
        <div className={table.tablePage}>
            <h1>
                Task '
                {
                    taskLoading || !task ? (
                        <Shimmer
                            height={22}
                            width={120}
                            className={loader.grayShimmer}
                        />
                    ) : (
                        task.name
                    )
                }
                ' submissions
            </h1>
            <TableContainer className={table.tableContainer}>
                <Toolbar className={table.toolbar}>
                    <Typography
                        variant='h6'
                        component='div'
                    >
                        Task submissions
                    </Typography>
                </Toolbar>
                <Table>
                    {
                        !submissions.length && (
                            <caption>
                                No responses to show yet. Once a student submits their work, it will appear here.
                            </caption>
                        )
                    }
                    <TableHead>
                        <TableRow>
                            <TableCell>Student name</TableCell>
                            <TableCell align='right'>Status</TableCell>
                            <TableCell align='right'>Response created</TableCell>
                            <TableCell align='right'>Submitted</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            submissions.map(submission => (
                                <StudentSubmissionRow
                                    task={submission}
                                    key={submission.id}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
