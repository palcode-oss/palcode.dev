export enum Perms {
    Student,
    Teacher,
    Admin
}

export interface User {
    email: string;
    displayName: string;
    perms: Perms;
}
