import React, { ReactElement, useCallback, useMemo } from 'react';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { Classroom, isSubmissionTask, SubmissionTask, TemplateTask } from '../types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Shimmer } from 'react-shimmer';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { useSnackbar } from 'notistack';
import { useUserByUsername } from '../helpers/auth';
import loader from '../styles/loader.module.scss';
import { ProjectStatus } from 'palcode-types';

interface Props {
    tasks: (TemplateTask | SubmissionTask)[];
    classroom: Classroom | null;
    memberUsername: string;
    setClassroomUpdater: (updater: number) => void;
}

export default function StudentRow(
    {
        classroom,
        tasks,
        memberUsername,
        setClassroomUpdater,
    }: Props,
): ReactElement {
    const [student, studentLoading] = useUserByUsername(memberUsername);

    const {enqueueSnackbar} = useSnackbar();
    const deleteStudent = useCallback(() => {
        if (!classroom) return;

        const confirmed = window.confirm(`Are you sure you want to remove ${memberUsername}? 
Their submissions will still be kept, and the student can be re-added at any time.`);
        if (!confirmed) return;

        firebase
            .firestore()
            .collection('classrooms')
            .doc(classroom.id)
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

    const userTasks = useMemo<SubmissionTask[]>(() => {
        if (!student) {
            return [];
        }

        return tasks.filter((task) => {
            return task.createdBy === student.uid && isSubmissionTask(task);
        }) as SubmissionTask[];
    }, [classroom, student, tasks]);

    const groupedSubmissions = useMemo<[number, number, number]>(() => {
        return [ProjectStatus.Unsubmitted, ProjectStatus.Submitted, ProjectStatus.HasFeedback].map(status => {
            return userTasks
                .filter(e => e.status === status)
                .length;
        }) as [number, number, number];
    }, [student, userTasks]);

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
                groupedSubmissions.map((count, index) => (
                    <TableCell
                        align='right'
                        key={index}
                    >
                        {count}
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
