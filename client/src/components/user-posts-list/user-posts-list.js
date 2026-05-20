import { jsx as _jsx } from "react/jsx-runtime";
import PostCard from '../post-card/post-card';
import { useGetUserPostsQuery } from '../../features/api/posts/postsApi';
import { EmptyPreview } from "../empty-preview/empty-preview";
import { useParams } from 'react-router-dom';
function UserCardList() {
    const { username } = useParams();
    const { data: posts, isLoading, error } = useGetUserPostsQuery(username);
    if (isLoading)
        return _jsx("div", { className: "error-message", children: "Loading..." });
    if (error) {
        if ('status' in error) {
            return (_jsx("div", { className: "error-message", children: `Error ${error.status}: ${JSON.stringify(error.data)}` }));
        }
    }
    if (posts?.length === 0) {
        return (_jsx(EmptyPreview, { isProfile: true }));
    }
    return (_jsx("div", { className: "post-list", children: posts?.map((post) => (_jsx(PostCard, { id: post.id, content: post.content, createdAt: post.createdAt, attachmentsCount: post.attachmentsCount, attachmentsTotalSize: post.attachmentsTotalSize, likesCount: post.likesCount, isLikedByCurrentUser: post.isLikedByCurrentUser, author: post.author }, post.id))) }));
}
export { UserCardList };
