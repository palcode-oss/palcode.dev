import { Classroom, ClassroomDoc } from '../types';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';

export function useClassroom(classroomId: string, classroomUpdater?: any): Classroom | null {
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    useEffect(() => {
        firebase
            .firestore()
            .collection('classrooms')
            .doc(classroomId)
            .get()
            .then(doc => {
                const data = {
                    ...doc.data() as ClassroomDoc,
                    id: doc.id,
                } as Classroom;
                setClassroom(data);
            });
    }, [classroomId, classroomUpdater]);

    return classroom;
}

export function useClassrooms(username: string): [Classroom[], boolean] {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [classroomsLoading, setClassroomsLoading] = useState(true);

    useEffect(() => {
        setClassroomsLoading(true);
        firebase
            .firestore()
            .collection('classrooms')
            .where('members', 'array-contains', username)
            .get()
            .then(data => {
                setClassrooms(data.docs.map(doc => ({
                    ...doc.data() as ClassroomDoc,
                    id: doc.id,
                })) as Classroom[]);
                setClassroomsLoading(false);
            });
    }, [username]);

    return [classrooms, classroomsLoading];
}

export function useOwnedClassroom(userId: string, updater?: any): [Classroom[], boolean] {
    const [classroomData, setClassroomData] = useState<Classroom[]>([]);
    const [classroomDataLoading, setClassroomDataLoading] = useState(true);

    useEffect(() => {
        setClassroomDataLoading(true);
        async function loadClassroomData() {
            const data = await firebase
                .firestore()
                .collection('classrooms')
                .get()
                .then(data => data.docs);

            setClassroomData(
                data.map((doc) => ({
                    ...doc.data() as Classroom,
                    id: doc.id,
                })),
            );
            setClassroomDataLoading(false);
        }

        loadClassroomData();
    }, [updater, userId]);

    return [classroomData, classroomDataLoading];
}
