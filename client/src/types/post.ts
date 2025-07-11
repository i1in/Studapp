import { Likes } from './like'
import { Comments } from './comment'

type Author = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    faculty: string;
    avatarUrl: string;
};

type Attachments = {
    id: number;
    postId: number;
    filename: string;
    fileUrl: string;
    mimeTipe: string;
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
    comments: Comments[]
}
