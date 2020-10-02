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

export enum TaskStatus {
    Unsubmitted,
    Submitted,
    HasFeedback,
}

export enum TaskType {
    Template,
    Submission,
}

export interface TaskProps {
    name: string;
    created: firebase.firestore.Timestamp;
    createdBy: string;
    status: TaskStatus;
    type: TaskType;
    id: string;
}

export interface TemplateTask extends TaskProps{
    taskType: TaskType.Template;
}

export interface SubmissionTask extends TaskProps{
    taskType: TaskType.Submission;
    parentTask: string;
}

export type Task<T extends TaskType = TaskType.Submission> = T extends TaskType.Submission ? SubmissionTask
    : T extends TaskType.Template ? TemplateTask
        : never

export interface Classroom {
    created: firebase.firestore.Timestamp;
    name: string;
    members: string[];
    owner: string;
    tasks: Task[];
    code: string;
    id: string;
}
