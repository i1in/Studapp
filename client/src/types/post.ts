import { Likes } from './like'
import { Comment } from './comment'

export type Author = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    faculty: string;
    avatarUrl: string;
};

export type Attachments = {
    id: number;
    postId: number;
    filename: string;
    fileUrl: string;
    mimeType: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    originalName: string;
}

export type PostList = {
    id: number;
    authorId: number;
    content: string;
    visibility: boolean;
    createdAt: string;
    updatedAt: string;
    attachmentsCount: number;
    attachmentsTotalSize: number;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    author: Author
};

export type FullPost = { 
    id: number;
    authorId: number;
    content: string;
    visibility: boolean;
    createdAt: string;
    updatedAt: string;
    attachmentsCount: number;
    attachmentsTotalSize: number;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    author: Author,
    attachments: Attachments[],
    likes: Likes[],
    comments: Comment[]
}
