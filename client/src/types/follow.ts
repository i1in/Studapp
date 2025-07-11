type Author = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string;
}

type Follower = {
    id: number;
    author: Author
}

export interface getFollows {
    isUserFollowed: boolean;
    followers: Follower[]
}

export interface Follow {
    followeeId: number;
    followerId: number;
}

export interface Followed {
    followed: boolean;
}