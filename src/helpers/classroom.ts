import { Classroom } from './types';
import { useEffect, useState } from 'react';
import firebase from 'firebase';

export function useClassroom(classroomId: string, classroomUpdater?: any): Classroom | null {
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
    }, [classroomId, classroomUpdater]);

    return classroom;
}

export function useClassrooms(userId: string): [Classroom[], boolean] {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [classroomsLoading, setClassroomsLoading] = useState(true);

    useEffect(() => {
        setClassroomsLoading(true);
        firebase
            .firestore()
            .collection('classrooms')
            .where('members', 'array-contains', userId)
            .get()
            .then(data => {
                setClassrooms(data.docs.map(doc => doc.data()) as Classroom[]);
                setClassroomsLoading(false);
            });
    }, [userId]);

    return [classrooms, classroomsLoading];
}
