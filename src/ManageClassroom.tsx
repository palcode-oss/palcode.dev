import React, { ReactElement, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { useParams } from 'react-router-dom';
import firebase from 'firebase';
import { Classroom } from './helpers/types';
import Loader from 'react-loader-spinner';
import StudentRow from './ui/StudentRow';

export function useClassroom(classroomId: string): Classroom | null {
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
    }, [classroomId]);

    return classroom;
}

interface Params {
    classroomId: string;
}

export default function ManageClassroom(): ReactElement {
    const {classroomId} = useParams<Params>();
    const classroomData = useClassroom(classroomId);

    return (
        <div className='manage-classroom'>
            {
                classroomData ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Student name</TableCell>
                                    <TableCell align='right'>Tasks viewed</TableCell>
                                    <TableCell align='right'>Tasks completed</TableCell>
                                    <TableCell align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    classroomData.members.map(studentId => (
                                        <StudentRow
                                            studentId={studentId}
                                            key={studentId}
                                        />
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
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
