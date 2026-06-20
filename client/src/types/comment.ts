export type CommentAuthor = {
    id: number;
    firstName: string;
    lastName: string;
    faculty: string;
    username: string;
    avatarUrl: string;
}

export type Comment = {
    id: number;
    postId: number;
    authorId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: CommentAuthor;

    replyToId: number | null;
    
    replyTo?: {
        id: number;
        content: string;
        authorId: number;
        author: Pick<CommentAuthor, 'id' | 'firstName' | 'lastName' | 'username'>;
    } | null;
}
