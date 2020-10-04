import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import { TaskStatus } from './types';

export function uploadVoiceFeedback(taskId: string, audio: Blob): firebase.storage.UploadTask {
    return firebase.storage()
        .ref('feedback/' + taskId + '.mp3')
        .put(audio);
}

export function deleteVoiceFeedback(taskId: string): Promise<any> {
    return firebase.storage()
        .ref('feedback/' + taskId + '.mp3')
        .delete();
}

export function getVoiceFeedbackDownloadUrl(taskId: string): Promise<any> {
    return firebase.storage()
        .ref('feedback/' + taskId + '.mp3')
        .getDownloadURL();
}

async function updateTaskFeedback(taskId: string, target: TaskStatus): Promise<void> {
    await firebase.firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
            status: target,
        });

    await firebase.firestore()
        .collection('tasks')
        .doc(taskId)
        .collection('statusUpdates')
        .add({
            status: target,
            createdAt: firebase.firestore.Timestamp.now(),
        });
}

export function completeTaskFeedback(taskId: string): Promise<void> {
    return updateTaskFeedback(taskId, TaskStatus.HasFeedback);
}

export function uncompleteTaskFeedback(taskId: string) {
    return updateTaskFeedback(taskId, TaskStatus.Submitted);
}
