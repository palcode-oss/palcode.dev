import { Task } from './types';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default function useTask(taskId: string): [Task | null, boolean] {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        firebase.firestore()
            .collection('tasks')
            .doc(taskId)
            .get()
            .then(response => {
                setLoading(false);

                if (!response.exists) {
                    return;
                }

                setTask({
                    ...response.data() as Task,
                    id: response.id,
                });
            });
    }, [taskId]);

    return [task, loading];
}
