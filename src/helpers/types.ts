import firebase from 'firebase/app';

export enum Perms {
    Student,
    Teacher,
    Admin
}

export interface User {
    email: string;
    displayName: string;
    username: string;
    perms: Perms;
    uid: string;
}

export type UserDoc = Omit<User, 'uid'>;

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
    id: string;
}

export interface TemplateTask extends TaskProps {
    type: TaskType.Template;
}

export interface SubmissionTask extends TaskProps {
    type: TaskType.Submission;
    status: TaskStatus;
    parentTask: string;
    feedback?: string;
}

export type Task<T extends TaskType = any> = T extends TaskType.Submission ? SubmissionTask
    : T extends TaskType.Template ? TemplateTask
        : never

export type TaskDoc<T extends TaskType = any> = Omit<Task<T>, 'id'>;

export function isSubmissionTask(task?: Task | null): task is SubmissionTask {
    return task?.type === TaskType.Submission
}

export function isTemplateTask(task: Task): task is TemplateTask {
    return task.type === TaskType.Template
}

export interface Classroom {
    created: firebase.firestore.Timestamp;
    name: string;
    members: string[];
    owner: string;
    tasks: string[];
    id: string;
}

export type ClassroomDoc = Omit<Classroom, 'id'>;
