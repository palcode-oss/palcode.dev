import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { Task, TaskStatus, TaskType, User } from '../helpers/types';
import firebase from 'firebase';
import 'firebase/firestore';
import { Shimmer } from 'react-shimmer';
import DropdownMenu from './DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { useSnackbar } from 'notistack';
import { useClassroom } from '../helpers/classroom';

interface Props {
    studentId: string;
    classroomId: string;
    setClassroomUpdater: (updater: number) => void;
}

export function useStudent(studentId: string) {
    const [student, setStudent] = useState<User | null>(null);
    useEffect(() => {
        firebase
            .firestore()
            .collection('users')
            .doc(studentId)
            .get()
            .then(doc => {
                const data = doc.data() as User;
                setStudent(data);
            });
    }, [studentId]);

    return student;
}

export default function StudentRow(
    {
        studentId,
        classroomId,
        setClassroomUpdater,
    }: Props,
): ReactElement {
    const student = useStudent(studentId);
    const classroom = useClassroom(classroomId);

    const userTasks = useMemo<Task[] | null>(() => {
        if (!classroom) return null;

        return classroom.tasks.filter((task) => {
            return task.createdBy === studentId && task.type === TaskType.Submission
        });
    }, [studentId, classroom]);

    const {enqueueSnackbar} = useSnackbar();
    const deleteStudent = useCallback(() => {
        if (classroom) {
            firebase
                .firestore()
                .collection('classrooms')
                .doc(classroomId)
                .update(
                    {
                        members: classroom.members.filter(e => e !== studentId)
                    } as Partial<User>
                )
                .then(() => {
                    enqueueSnackbar('Student removed successfully!', {
                        variant: 'success',
                    });
                    setClassroomUpdater(Math.random());
                })
                .catch(() => {
                    enqueueSnackbar('Something went wrong while attempting to delete that student. Try again.', {
                        variant: 'error',
                    });
                });
        }
    }, [classroom, studentId]);

    return (
        <TableRow>
            <TableCell>
                {
                    student
                        ? student.displayName
                        : (
                            <Shimmer
                                height={12}
                                width={80}
                                className='shimmer'
                            />
                        )
                }
            </TableCell>
            {
                [TaskStatus.Unsubmitted, TaskStatus.Submitted, TaskStatus.HasFeedback].map(status => (
                    <TableCell align='right' key={status}>
                        {
                            userTasks
                                ? (
                                    userTasks.reduce((a, e) => e.status === status ? a + 1 : a, 0)
                                ) : (
                                    <Shimmer
                                        height={12}
                                        width={40}
                                        className='shimmer'
                                    />
                                )
                        }
                    </TableCell>
                ))
            }
            <TableCell align='center'>
                <DropdownMenu>
                    <MenuItem onClick={deleteStudent}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                        &nbsp;Remove student
                    </MenuItem>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
