import firebase from 'firebase/app';
import 'firebase/storage';

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
