import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Classroom, Task, User } from './helpers/types';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import firebase from 'firebase';
import 'firebase/firestore';
import TableBody from '@material-ui/core/TableBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import TimeAgo from 'timeago-react/lib/timeago-react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface Props {
    user: User
}

interface ClassroomData {
    id: string;
    created: number;
    members: string[];
    name: string;
    tasks: Task[];
}

export default function TeacherDashboard(
    {
        user,
    }: Props,
): ReactElement {
    const [classroomData, setClassroomData] = useState<ClassroomData[]>([]);
    const [classroomDataLoading, setClassroomDataLoading] = useState(true);

    const [classroomDataUpdater, setClassroomDataUpdater] = useState(0);
    useEffect(() => {
        async function loadClassroomData() {
            const data = await firebase
                .firestore()
                .collection('classrooms')
                .where('owner', '==', user.uid)
                .get()
                .then(data => data.docs);

            setClassroomData(
                data.map((doc) => {
                    const {created, members, name, tasks} = doc.data() as Classroom;

                    return {
                        name,
                        members,
                        created,
                        tasks,
                        id: doc.id,
                    };
                }),
            );
            setClassroomDataLoading(false);
        }

        loadClassroomData();
    }, [classroomDataUpdater]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const {enqueueSnackbar} = useSnackbar();
    const handleDelete = useCallback((classroomId: string) => {
        handleClose();
        firebase
            .firestore()
            .collection('classrooms')
            .doc(classroomId)
            .delete()
            .then(() => {
                enqueueSnackbar('Classroom deleted successfully!', {
                    variant: 'success',
                });
                setClassroomDataUpdater(Math.random());
            })
            .catch(() => {
                enqueueSnackbar('Something went wrong while attempting to delete classroom. Try again.', {
                    variant: 'error',
                });
            });
    }, []);

    return (
        <div className='teacher dashboard'>
            <div className='dashboard-card'>
                <div className='card-heading'>
                    My classrooms
                </div>
                <div className='card-body'>
                    <div className='card-table'>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Class name</TableCell>
                                        <TableCell align='right'>Students</TableCell>
                                        <TableCell align='right'>Tasks</TableCell>
                                        <TableCell align='right'>Created</TableCell>
                                        <TableCell align='center'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        classroomData.map(classroom => (
                                            <TableRow key={classroom.id}>
                                                <TableCell>{classroom.name}</TableCell>
                                                <TableCell align='right'>{classroom.members.length}</TableCell>
                                                <TableCell align='right'>{classroom.tasks.length}</TableCell>
                                                <TableCell align='right'>
                                                    <TimeAgo
                                                        datetime={classroom.created}
                                                        locale='en_GB'
                                                    />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <button
                                                        className='more-dropdown'
                                                        onClick={openMenu}
                                                    >
                                                        <FontAwesomeIcon icon={faEllipsisV}/>
                                                    </button>

                                                    <Menu
                                                        id='table-menu'
                                                        anchorEl={anchorEl}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'right',
                                                        }}
                                                        keepMounted
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}
                                                        open={!!anchorEl}
                                                        onClose={handleClose}
                                                    >
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
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
