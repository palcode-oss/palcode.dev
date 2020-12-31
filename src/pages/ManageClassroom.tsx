import React, { ReactElement, useMemo, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { Link, useParams } from 'react-router-dom';
import StudentRow from '../components/StudentRow';
import TaskRow from '../components/TaskRow';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { useClassroom } from '../helpers/classroom';
import table from '../styles/table.module.scss';
import NewTaskModal from '../components/NewTaskModal';
import { useClassroomTasks } from '../helpers/taskData';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../ui/Spinner';
import TabSwitcher from '../ui/TabSwitcher';
import { isTemplateTask, TemplateTask } from '../types';

interface Params {
    classroomId: string;
}

enum TabSelection {
    Tasks,
    Students,
}

export default function ManageClassroom(): ReactElement {
    const {classroomId} = useParams<Params>();

    const [classroomUpdater, setClassroomUpdater] = useState(0);
    const classroomData = useClassroom(classroomId, classroomUpdater);
    const [tasks, loading] = useClassroomTasks(classroomData?.id);

    const templateTasks = useMemo<TemplateTask[]>(() => {
        return tasks.filter(task => isTemplateTask(task)) as TemplateTask[];
    }, [tasks]);

    const [showModal, setShowModal] = useState(false);

    const [tab, setTab] = useState<TabSelection>(TabSelection.Tasks);

    if (!classroomData || loading) {
        return <div className={table.tablePage}>
            <Spinner />
        </div>
    }

    return (
        <div className={table.tablePage}>
            <h1>
                {
                    classroomData.name
                }
            </h1>

            {
                showModal && (
                    <NewTaskModal
                        privateTask={false}
                        classroomId={classroomId}
                        closeModal={() => setShowModal(false)}
                    />
                )
            }

            <TabSwitcher
                tabs={['Tasks', 'Students']}
                tab={tab}
                onChange={setTab}
            />

            {tab === TabSelection.Tasks && <TableContainer className={table.tableContainer}>
                <Toolbar className={table.toolbar}>
                    <Typography
                        variant='h6'
                        component='div'
                    >
                        Class tasks
                    </Typography>
                    <Tooltip
                        title='Add new task'
                        className={table.button}
                    >
                        <IconButton onClick={() => setShowModal(true)}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <Table>
                    {
                        !templateTasks.length && !loading && (
                            <caption>
                                No tasks to show yet. Click the&nbsp;
                                <FontAwesomeIcon icon={faPlus}/>
                                &nbsp;button above to get started.
                            </caption>
                        )
                    }
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
                            templateTasks
                                .map((task) => (
                                    <TaskRow
                                        task={task}
                                        tasks={tasks}
                                        classroom={classroomData}
                                        classroomId={classroomId}
                                        setClassroomUpdater={setClassroomUpdater}
                                        key={task.id}
                                    />
                                ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>}

            {tab === TabSelection.Students && <TableContainer className={table.tableContainer}>
                <Toolbar className={table.toolbar}>
                    <Typography
                        variant='h6'
                        component='div'
                    >
                        Class students
                    </Typography>
                    <Tooltip
                        title='Add students'
                        className={table.button}
                    >
                        <Link to={`/classroom/${classroomId}/add_students`}>
                            <IconButton>
                                <FontAwesomeIcon icon={faUserPlus}/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                </Toolbar>
                <Table>
                    {
                        !classroomData.members.length && (
                            <caption>
                                No students found in classroom. You can add a list of student usernames&nbsp;
                                <Link to={`/classroom/${classroomId}/add_students`}>
                                    by clicking here
                                </Link>
                                .
                            </caption>
                        )
                    }
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
                            classroomData.members.map(username => (
                                <StudentRow
                                    tasks={tasks}
                                    classroom={classroomData}
                                    memberUsername={username}
                                    setClassroomUpdater={setClassroomUpdater}
                                    key={username}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    );
}
