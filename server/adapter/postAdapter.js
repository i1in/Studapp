const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;

export const adaptPostsToClient = (post) => {
    const baseUrl = getBaseUrl();

    return {
        id: String(post.id),
        authorId: post.authorId,
        content: post.content,
        visibility: post.visibility,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,

        attachmentsCount: Number(post.attachmentsCount) || 0,
        attachmentsTotalSize: Number(post.attachmentsTotalSize) || 0,

        likesCount: Number(post.likesCount),
        isLikedByCurrentUser: post.isLikedByCurrentUser,

        author: post.author ? {
            id: post.author.id,
            firstName: post.author.firstName,
            lastName: post.author.lastName,
            username: post.author.username 
                    ? post.author.username
                    : post.author.publicId,
            faculty: post.author.faculty,
            avatarUrl: post.author.avatarUrl
                ? `${post.author.avatarUrl}`
                : null // если авы не грузятся - в начадо ${baseUrl}
        } : null
    };
};

export const adaptFullPostToClient = (post) => {
    const baseUrl = getBaseUrl();

    let avatarUrl = post.author.avatarUrl;
    if (avatarUrl && !avatarUrl.startsWith('http')) {
        avatarUrl = `${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
    }

    const attachments = (post.attachments || []).map(att => {
        let fileUrl = att.fileUrl;
        if (fileUrl && !fileUrl.startsWith('http')) {
            fileUrl = `${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
        }

        return {
            id: att.id,
            filename: att.filename,
            originalName: att.originalName,
            mimeType: att.mimeType,
            size: att.size,
            createdAt: att.createdAt,
            fileUrl
        };
    });

    const likes = (post.likes || []).map(like => {
        let authorAvatar = like.author?.avatarUrl;
        if (authorAvatar && !authorAvatar.startsWith('http')) {
            authorAvatar = `${authorAvatar.startsWith('/') ? '' : '/'}${authorAvatar}`;
        }

        return {
            id: like.id,
            createdAt: like.createdAt,
            author: {
                id: like.author?.id,
                firstName: like.author?.firstName,
                lastName: like.author?.lastName,
                username: like.author?.username || like.author?.publicId || null,
                avatarUrl: authorAvatar || null,
            }
        };
    });

    const comments = (post.comments || []).map(comment => {
        let commentAvatar = comment.author?.avatarUrl;
        if (commentAvatar && !commentAvatar.startsWith('http')) {
            commentAvatar = `${commentAvatar.startsWith('/') ? '' : '/'}${commentAvatar}`;
        }

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
                id: comment.author?.id,
                firstName: comment.author?.firstName,
                lastName: comment.author?.lastName,
                faculty: comment.author?.faculty,
                username: comment.author?.username || comment.author?.publicId || null,
                avatarUrl: commentAvatar || null
            }
        };
    });

    return {
        id: String(post.id),
        content: post.content,
        visibility: post.visibility,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,

        author: {
            id: post.author.id,
            firstName: post.author.firstName,
            lastName: post.author.lastName,
            username: post.author.username || post.author.publicId,
            faculty: post.author.faculty,
            avatarUrl
        },

        attachments,
        likes,
        comments
    };
};


export const adaptViewLikesToClient = (likes) => {
    const baseUrl = getBaseUrl();

    return {
        id: String(likes.id),
        postId: String(likes.postId),
        userId: String(likes.userId),
        createdAt: likes.createdAt,
        updatedAt: likes.updatedAt,
        author: {
            id: likes.author.id,
            username: likes.author.username,
            firstName: likes.author.firstName,
            lastName: likes.author.lastName,
            avatarUrl: likes.author.avatarUrl
                ? `${baseUrl}${likes.author.avatarUrl}`
                : null
        }
    }
}
