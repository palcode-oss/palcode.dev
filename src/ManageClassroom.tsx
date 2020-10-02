import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { Link, useParams } from 'react-router-dom';
import firebase from 'firebase';
import 'firebase/firestore';
import { Classroom, Task, TaskType } from './helpers/types';
import Loader from 'react-loader-spinner';
import StudentRow from './ui/StudentRow';
import TaskRow from './ui/TaskRow';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';

export function useClassroom(classroomId: string, classroomUpdater?: any): Classroom | null {
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    useEffect(() => {
        firebase
            .firestore()
            .collection('classrooms')
            .doc(classroomId)
            .get()
            .then(doc => {
                const data = doc.data() as Classroom;
                setClassroom(data);
            });
    }, [classroomId, classroomUpdater]);

    return classroom;
}

interface Params {
    classroomId: string;
}

export default function ManageClassroom(): ReactElement {
    const {classroomId} = useParams<Params>();

    const [classroomUpdater, setClassroomUpdater] = useState(0);
    const classroomData = useClassroom(classroomId, classroomUpdater);

    const tasks: Task[] = useMemo(() => {
        return classroomData
            ?.tasks
            .filter(task => task.type === TaskType.Template) || [];
    }, [classroomData]);

    return (
        <div className='manage-classroom'>
            {
                classroomData ? (
                    <>
                        <TableContainer>
                            <Toolbar>
                                <Typography
                                    variant='h6'
                                    component='div'
                                >
                                    Class students
                                </Typography>
                                <Tooltip title='Show code page'>
                                    <Link to={`/classroom/${classroomId}/view_code`}>
                                        <IconButton>
                                            <FontAwesomeIcon icon={faKeyboard}/>
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                            </Toolbar>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student name</TableCell>
                                        <TableCell align='right'>Tasks unsubmitted</TableCell>
                                        <TableCell align='right'>Tasks completed</TableCell>
                                        <TableCell align='right'>Tasks returned</TableCell>
                                        <TableCell align='center'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        classroomData.members.length
                                            ? (
                                                classroomData.members.map(studentId => (
                                                    <StudentRow
                                                        studentId={studentId}
                                                        classroomId={classroomId}
                                                        setClassroomUpdater={setClassroomUpdater}
                                                        key={studentId}
                                                    />
                                                ))
                                            ) : (
                                                <p>
                                                    No students found in classroom. Students can add themselves through
                                                    the&nbsp;
                                                    <Link to={`/classroom/${classroomId}/view_code`}>
                                                        code page
                                                    </Link>
                                                    .
                                                </p>
                                            )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TableContainer>
                            <Toolbar>
                                <Typography
                                    variant='h6'
                                    component='div'
                                >
                                    Class tasks
                                </Typography>
                                <Tooltip title='Add new task'>
                                    <Link to={`/task/new`}>
                                        <IconButton>
                                            <FontAwesomeIcon icon={faPlus}/>
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                            </Toolbar>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Task name</TableCell>
                                        <TableCell align='right'>Created</TableCell>
                                        <TableCell align='right'>Not submitted</TableCell>
                                        <TableCell align='right'>Submissions to return</TableCell>
                                        <TableCell align='right'>Returned submission</TableCell>
                                        <TableCell align='center'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        tasks.length ?
                                            (
                                                tasks
                                                    .map((task) => (
                                                        <TaskRow
                                                            taskId={task.id}
                                                            classroom={classroomData}
                                                            classroomId={classroomId}
                                                            setClassroomUpdater={setClassroomUpdater}
                                                            key={task.id}
                                                        />
                                                    ))
                                            ) : (
                                                <p>
                                                    No tasks to show yet. Click the&nbsp;
                                                    <FontAwesomeIcon icon={faPlus}/>
                                                    &nbsp;button above to get started.
                                                </p>
                                            )

                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                ) : (
                    <Loader
                        type='Oval'
                        width={120}
                        height={120}
                        color='blue'
                    />
                )
            }
        </div>
    );
}
