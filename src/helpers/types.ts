import firebase from 'firebase/app';

export type SchoolAuthService = 'azure.com';

export interface SchoolAuth {
    domain: string;
    service: SchoolAuthService;
    tenant: string;
}

export interface School {
    id: string;
    name: string;
    auth: SchoolAuth;
}

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
    Private,
}

export interface TaskProps {
    name: string;
    created: firebase.firestore.Timestamp;
    createdBy: string;
    id: string;
}

export interface TemplateTask extends TaskProps {
    type: TaskType.Template;
    classroomId: string;
}

export interface SubmissionTask extends TaskProps {
    type: TaskType.Submission;
    status: TaskStatus;
    parentTask: string;
    feedback?: string;
    classroomId: string;
}

export interface PrivateTask extends TaskProps {
    type: TaskType.Private;
}

export type Task<T extends TaskType = any> = T extends TaskType.Submission ? SubmissionTask
    : T extends TaskType.Template ? TemplateTask
        : T extends TaskType.Private ? PrivateTask
            : never;

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
    id: string;
}

export type ClassroomDoc = Omit<Classroom, 'id'>;
