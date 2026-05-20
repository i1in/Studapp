import { jsx as _jsx } from "react/jsx-runtime";
import PostCard from '../post-card/post-card';
import { useGetPostsQuery } from '../../features/api/posts/postsApi';
import { EmptyPreview } from "../empty-preview/empty-preview";
function PostCardList() {
    const { data: posts, isLoading, error } = useGetPostsQuery();
    if (isLoading)
        return (_jsx("div", { className: "loading", children: _jsx("p", { className: "loading-title", children: "Loading" }) }));
    if (error) {
        if ('status' in error) {
            return (_jsx("div", { className: "error-message", children: `Error ${error.status}: ${JSON.stringify(error.data)}` }));
        }
    }
    if (posts?.length === 0) {
        return (_jsx(EmptyPreview, { isProfile: false }));
    }
    return (_jsx("div", { className: "post-list", children: posts?.map((post) => (_jsx(PostCard, { id: post.id, content: post.content, createdAt: post.createdAt, attachmentsCount: post.attachmentsCount, attachmentsTotalSize: post.attachmentsTotalSize, likesCount: post.likesCount, isLikedByCurrentUser: post.isLikedByCurrentUser, author: post.author }, post.id))) }));
}
export { PostCardList };
