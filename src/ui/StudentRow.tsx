import React, { ReactElement, useCallback, useMemo } from 'react';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { isSubmissionTask, SubmissionTask, TaskStatus, User } from '../helpers/types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Shimmer } from 'react-shimmer';
import DropdownMenu from './DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { useSnackbar } from 'notistack';
import { useClassroom } from '../helpers/classroom';
import { useTasks } from '../helpers/taskData';
import { useUserByUsername } from '../helpers/auth';
import loader from '../styles/loader.module.scss';

interface Props {
    memberUsername: string;
    classroomId: string;
    setClassroomUpdater: (updater: number) => void;
}

export default function StudentRow(
    {
        memberUsername,
        classroomId,
        setClassroomUpdater,
    }: Props,
): ReactElement {
    const [student, studentLoading] = useUserByUsername(memberUsername);
    const classroom = useClassroom(classroomId);

    const [tasks, tasksLoading] = useTasks(classroom?.tasks || []);
    const userTasks = useMemo<SubmissionTask[] | null>(() => {
        if (!classroom || tasksLoading) return null;

        if (!student) {
            return [];
        }

        return tasks.filter((task) => {
            return task.createdBy === student.uid && isSubmissionTask(task);
        }) as SubmissionTask[];
    }, [classroom, student, tasks]);

    const {enqueueSnackbar} = useSnackbar();
    const deleteStudent = useCallback(() => {
        if (classroom) {
            firebase
                .firestore()
                .collection('classrooms')
                .doc(classroomId)
                .update({
                        members: firebase.firestore.FieldValue.arrayRemove(memberUsername),
                })
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
    }, [classroom, memberUsername]);

    const studentName = useMemo(() => {
        if (student) {
            return student.displayName;
        }

        if (!student && studentLoading) {
            return null;
        }

        if (!student && !studentLoading) {
            return memberUsername + ' (not signed up)';
        }
    }, [student, studentLoading, memberUsername]);

    return (
        <TableRow>
            <TableCell>
                {
                    studentName
                        ? studentName
                        : (
                            <Shimmer
                                height={12}
                                width={80}
                                className={loader.grayShimmer}
                            />
                        )
                }
            </TableCell>
            {
                [TaskStatus.Unsubmitted, TaskStatus.Submitted, TaskStatus.HasFeedback].map(status => (
                    <TableCell
                        align='right'
                        key={status}
                    >
                        {
                            userTasks
                                ? (
                                    userTasks.reduce((a, e) => e.status === status ? a + 1 : a, 0)
                                ) : (
                                    <Shimmer
                                        height={12}
                                        width={40}
                                        className={loader.grayShimmer}
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
