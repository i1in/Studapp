export interface UserRooler {
    id: number,
    email:string,
    firstName: string,
    lastName: string,
    username: string,
    role: string,
    faculty: string,
    avatarUrl: string,
}

export interface User {
    id: number,
    firstName: string,
    lastname: string,
    username: string,
    status: string,
    role: string,
    faculty: string,
    avatarUrl: string,
    followCount: number,
    isFollowedByCurrentUser: boolean,
}