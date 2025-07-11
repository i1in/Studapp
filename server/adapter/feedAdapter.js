const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;

export const adaptFeedToClient = (f) => {
    const baseUrl = getBaseUrl();

    return {
        id: f.id,
        authorId: f.authorId,
        content: f.content,
        visibility: f.visibility,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        attachmentsCount: Number(f.attachmentsCount),
        attachmentsTotalSize: Number(f.attachmentsTotalSize),
        likesCount: Number(f.likesCount),
        isLikedByCurrentUser: f.isLikedByCurrentUser,
        author: {
            id: f.author.id,
            firstName: f.author.firstName,
            lastName: f.author.lastName,
            username: f.author.username 
                    ? f.author.username
                    : f.author.publicId,
            faculty: f.author.faculty,    
            avatarUrl: f.author.avatarUrl
                ? `${f.author.avatarUrl}`
                : null
            // `${baseUrl}${f.author.avatarUrl}` - использовать в случае чего
        }
    };
};