const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;

export const adaptFollowersToClient = (f) => {
    const baseUrl = getBaseUrl();

    return {
        id: f.id,
        author: {
            id: f.followerId,
            firstName: f.follower.firstName,
            lastName: f.follower.lastName,
            username: f.follower.username || f.follower.publicId,
            avatarUrl: f.follower.avatarUrl
                ? `${baseUrl}${f.follower.avatarUrl}`
                : null
        }
    };
};