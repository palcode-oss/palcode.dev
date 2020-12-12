import React, { lazy, ReactElement, Suspense, useCallback, useState } from 'react';
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
import { useSnackbar } from 'notistack';
import Toolbar from '@material-ui/core/Toolbar';
import table from './styles/table.module.scss';
import loader from './styles/loader.module.scss';
import Typography from '@material-ui/core/Typography';
import { useOwnedClassroom } from './helpers/classroom';
import Loader from 'react-loader-spinner';
import IconButton from '@material-ui/core/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import Tooltip from '@material-ui/core/Tooltip';
import NewClassroomModal, { NewClassroomAction } from './ui/NewClassroomModal';
import LazyComponentFallback from './ui/LazyComponentFallback';
import PrivateTasks from './ui/PrivateTasks';

const ClassroomRow = lazy(() => import('./ui/ClassroomRow'));

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
    const handleDelete = useCallback(async (classroomId: string) => {
        if (!window.confirm('Are you sure you want to delete this classroom? This action is irreversible.')) {
            return;
        }

        try {
            await firebase.firestore()
                .collection('classrooms')
                .doc(classroomId)
                .delete();
        } catch (e) {
            enqueueSnackbar('Something went wrong while attempting to delete that classroom. Try again.', {
                variant: 'error',
            });
            return;
        }

        const tasks = await firebase.firestore()
            .collection('tasks')
            .where('classroomId', '==', classroomId)
            .get()
            .catch(() => {
                enqueueSnackbar('Something went wrong while attempting to delete the class tasks. The classroom was still deleted. No action is required', {
                    variant: 'info',
                });
                return null;
            });

        if (!tasks) return;

        const batch = firebase.firestore().batch();
        tasks.docs.forEach(task => {
            batch.delete(task.ref);
        });

        try {
            await batch.commit();
        } catch (e) {
            enqueueSnackbar('Something went wrong while attempting to delete the class tasks. The classroom was still deleted. No action is required.', {
                variant: 'info',
            });
            return;
        }

        enqueueSnackbar('Classroom deleted successfully!', {
            variant: 'success',
        });
        setClassroomDataUpdater(Math.random());
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState<NewClassroomAction>(NewClassroomAction.New);
    const [cloneClassroomId, setCloneClassroomId] = useState('');

    const openNewModal = useCallback(() => {
        setShowModal(true);
        setModalAction(NewClassroomAction.New);
    }, []);

    const openCloneModal = useCallback((classroomId: string) => {
        setShowModal(true);
        setModalAction(NewClassroomAction.Clone);
        setCloneClassroomId(classroomId);
    }, []);

    return (
        <div className={table.tablePage}>
            {
                !classroomDataLoading ? (
                    <>
                        <h1 className={table.header}>
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
                                    <IconButton onClick={openNewModal}>
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
                                    <Suspense fallback={<LazyComponentFallback />}>
                                        {
                                            classroomData.map(classroom => (
                                                <ClassroomRow
                                                    classroom={classroom}
                                                    handleDelete={handleDelete}
                                                    openCloneModal={openCloneModal}
                                                    key={classroom.id}
                                                />
                                            ))
                                        }
                                    </Suspense>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <PrivateTasks />

                        {
                            showModal && (
                                <NewClassroomModal
                                    closeModal={() => setShowModal(false)}
                                    modalAction={modalAction}
                                    classroomId={cloneClassroomId}
                                />
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
