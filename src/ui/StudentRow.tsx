import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { Task, TaskStatus, TaskType, User } from '../helpers/types';
import firebase from 'firebase';
import { Shimmer } from 'react-shimmer';
import { useClassroom } from '../ManageClassroom';

interface Props {
    studentId: string;
    classroomId: string;
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
                    <TableCell align='right'>
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
        </TableRow>
    );
}
