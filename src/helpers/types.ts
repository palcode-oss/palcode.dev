import firebase from 'firebase';

export enum Perms {
    Student,
    Teacher,
    Admin
}

export interface User {
    email: string;
    displayName: string;
    perms: Perms;
    uid: string;
}

export interface Task {

}

export interface Classroom {
    created: firebase.firestore.Timestamp;
    name: string;
    members: string[];
    owner: string;
    tasks: Task[];
    code: string;
    id: string;
}
