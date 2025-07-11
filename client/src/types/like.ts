type LikeAuthor = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    atatarUrl: string;
}

export type Likes = {
    id: number;
    createdAt: string;
    updatedAt: string;
    author: LikeAuthor;
}

export type Like = {
    postId: number;
    userId: number;
}