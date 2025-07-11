type CommentAuthor = {
    id: number;
    firstName: string;
    username: string;
    avatarUrl: string;
}

export type Comment = {
    id: number;
    content: string;
    createdAt: string;
    author: CommentAuthor,
}