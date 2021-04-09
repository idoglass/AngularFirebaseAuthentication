export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    name?: string;
    groups?: string[];
    birthday?: Date;
    lastLoginAt?: string;
 }

export class User implements User{
    uid: string;
    name?: string;
    email: string;
    birthday?: Date;

}
