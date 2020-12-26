import { Classroom, ClassroomDoc } from '../types';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { useSchoolId } from './school';

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
    const schoolId = useSchoolId();

    useEffect(() => {
        if (!schoolId) return;

        setClassroomsLoading(true);
        firebase
            .firestore()
            .collection('classrooms')
            .where('members', 'array-contains', username)
            .where('schoolId', '==', schoolId)
            .get()
            .then(data => {
                setClassrooms(data.docs.map(doc => ({
                    ...doc.data() as ClassroomDoc,
                    id: doc.id,
                })) as Classroom[]);
                setClassroomsLoading(false);
            });
    }, [username, schoolId]);

    return [classrooms, classroomsLoading];
}

export function useSchoolClassrooms(updater?: any): [Classroom[], boolean] {
    const [classroomData, setClassroomData] = useState<Classroom[]>([]);
    const [classroomDataLoading, setClassroomDataLoading] = useState(true);
    const schoolId = useSchoolId();

    useEffect(() => {
        if (!schoolId) return;

        async function loadClassroomData() {
            setClassroomDataLoading(true);
            const data = await firebase
                .firestore()
                .collection('classrooms')
                .where('schoolId', '==', schoolId)
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
    }, [updater, schoolId]);

    return [classroomData, classroomDataLoading];
}
