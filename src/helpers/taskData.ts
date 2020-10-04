import { Task, TaskDoc } from './types';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

export function useTask(taskId: string): [Task | null, boolean] {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return firebase.firestore()
            .collection('tasks')
            .doc(taskId)
            .onSnapshot(response => {
                setLoading(false);

                if (!response.exists) {
                    return;
                }

                setTask({
                    ...response.data() as TaskDoc,
                    id: response.id,
                } as Task);
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
                    .then(snapshot => {
                        if (snapshot.exists) {
                            return {
                                ...snapshot.data() as TaskDoc,
                                id: snapshot.id,
                            } as Task;
                        } else {
                            return null;
                        }
                    })
                    .catch(() => null),
                ),
        )
            .then(tasks => {
                setTasksLoading(false);
                setTasks(tasks.filter(task => task) as Task[]);
            });
    }, [taskIds.join(',')]);

    return [tasks, tasksLoading];
}
