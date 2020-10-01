import React, { ReactElement, useEffect, useState } from 'react';
import { TableCell } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { User } from '../helpers/types';
import firebase from 'firebase';
import { Shimmer } from 'react-shimmer';

interface Props {
    studentId: string;
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
    }: Props,
): ReactElement {
    const student = useStudent(studentId);

    return (
        <TableRow>
            <TableCell>
                {
                    student
                        ? student.displayName
                        : (
                            <Shimmer
                                height={12}
                                width={70}
                                className='shimmer'
                            />
                        )
                }
            </TableCell>
            <TableCell align='right'>d</TableCell>
            <TableCell align='right'>d</TableCell>
        </TableRow>
    );
}
