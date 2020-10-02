import React, { ReactElement, useEffect, useState } from 'react';
import { Classroom, User } from './helpers/types';
import firebase from 'firebase';
import 'firebase/firestore';
import Loader from 'react-loader-spinner';
import ClassroomCard from './ui/ClassroomCard';

interface Props {
    user: User
}

export default function StudentDashboard(
    {
        user
    }: Props
): ReactElement {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [classroomsLoading, setClassroomsLoading] = useState(true);

    useEffect(() => {
        setClassroomsLoading(true);
        firebase
            .firestore()
            .collection('classrooms')
            .where('members', 'array-contains', user.uid)
            .get()
            .then(data => {
                setClassrooms(data.docs.map(doc => doc.data()) as Classroom[]);
                setClassroomsLoading(false);
            });
    }, [user]);

    return (
        <div className='student dashboard'>
            <h1>
                My classrooms
            </h1>
            {
                classroomsLoading ? (
                    <Loader
                        type='Oval'
                        width={120}
                        height={120}
                        color='blue'
                    />
                ) : (
                    <div className='classroom-card-container'>
                        {
                            classrooms.map(classroom => (
                                <ClassroomCard classroom={classroom} />
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}
