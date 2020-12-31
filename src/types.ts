import firebase from 'firebase/app';
import { ProjectStatus, ProjectType } from 'palcode-types';

export type SchoolAuthService = 'microsoft.com' | 'google.com';

export interface SchoolAuth {
    domains: string[];
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
    schoolId: string;
}

export type UserDoc = Omit<User, 'uid'>;

export type TaskLanguage = 'python' | 'nodejs' | 'bash' | 'java' | 'prolog' | 'go' | 'cpp';

export interface TaskProps {
    name: string;
    created: firebase.firestore.Timestamp;
    createdBy: string;
    language: TaskLanguage;
    id: string;
}

export interface TemplateTask extends TaskProps {
    type: ProjectType.Template;
    classroomId: string;
}

export interface SubmissionTask extends TaskProps {
    type: ProjectType.Submission;
    status: ProjectStatus;
    parentTask: string;
    feedback?: string;
    classroomId: string;
}

export interface PrivateTask extends TaskProps {
    type: ProjectType.Private;
}

export type Task<T extends ProjectType = any> = T extends ProjectType.Submission ? SubmissionTask
    : T extends ProjectType.Template ? TemplateTask
        : T extends ProjectType.Private ? PrivateTask
            : never;

export type TaskDoc<T extends ProjectType = any> = Omit<Task<T>, 'id'>;

export function isSubmissionTask(task?: Task | null): task is SubmissionTask {
    return task?.type === ProjectType.Submission
}

export function isTemplateTask(task: Task): task is TemplateTask {
    return task.type === ProjectType.Template
}

export interface Classroom {
    created: firebase.firestore.Timestamp;
    name: string;
    members: string[];
    owner: string;
    id: string;
}

export type ClassroomDoc = Omit<Classroom, 'id'>;
