import React, { ReactElement, useCallback, useState } from 'react';
import { User } from './helpers/types';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import TableBody from '@material-ui/core/TableBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuItem from '@material-ui/core/MenuItem';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import DropdownMenu from './ui/DropdownMenu';
import Toolbar from '@material-ui/core/Toolbar';
import table from './styles/table.module.scss';
import loader from './styles/loader.module.scss';
import Typography from '@material-ui/core/Typography';
import { useOwnedClassroom } from './helpers/classroom';
import Loader from 'react-loader-spinner';
import IconButton from '@material-ui/core/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import Tooltip from '@material-ui/core/Tooltip';
import NewClassroomModal from './ui/NewClassroomModal';

interface Props {
    user: User
}

export default function TeacherDashboard(
    {
        user,
    }: Props,
): ReactElement {
    const [classroomDataUpdater, setClassroomDataUpdater] = useState(0);
    const [classroomData, classroomDataLoading] = useOwnedClassroom(user.uid, classroomDataUpdater);

    const {enqueueSnackbar} = useSnackbar();
    const handleDelete = useCallback((classroomId: string) => {
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
                enqueueSnackbar('Something went wrong while attempting to delete that classroom. Try again.', {
                    variant: 'error',
                });
            });
    }, []);

    const [showModal, setShowModal] = useState(false);

    return (
        <div className={table.tablePage}>
            {
                !classroomDataLoading ? (
                    <>
                        <h1>
                            My dashboard
                        </h1>
                        <TableContainer className={table.tableContainer}>
                            <Toolbar className={table.toolbar}>
                                <Typography
                                    variant='h6'
                                    component='div'
                                >
                                    My classrooms
                                </Typography>
                                <Tooltip
                                    title='Create new classroom'
                                    className={table.button}
                                >
                                    <IconButton onClick={() => setShowModal(true)}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                            <Table>
                                {
                                    !classroomData.length && (
                                        <caption>
                                            No classrooms to show yet. Click the&nbsp;
                                            <FontAwesomeIcon icon={faPlus}/>
                                            &nbsp;button above to create one.
                                        </caption>
                                    )
                                }
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
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            showModal && (
                                <NewClassroomModal closeModal={() => setShowModal(false)} />
                            )
                        }
                    </>
                ) : (
                    <div className={loader.loader}>
                        <Loader
                            type='Oval'
                            width={120}
                            height={120}
                            color='blue'
                        />
                    </div>
                )
            }
        </div>
    );
}
