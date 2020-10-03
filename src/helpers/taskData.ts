import { Task } from './types';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

export function useTask(taskId: string): [Task | null, boolean] {
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

export function useTasks(taskIds: string[]): [Task[], boolean] {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksLoading, setTasksLoading] = useState(false);

    useEffect(() => {
        setTasksLoading(true);
        Promise.all(
            taskIds
                .map(taskId => firebase
                    .firestore()
                    .collection('tasks')
                    .doc(taskId)
                    .get()
                    .then(snapshot => snapshot.data() as Task),
                ),
        )
            .then(tasks => {
                setTasksLoading(false);
                setTasks(tasks);
            });
    }, [taskIds.join(',')]);

    return [tasks, tasksLoading];
}
