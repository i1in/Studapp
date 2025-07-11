const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;

export const adaptUserToClient = (user) => {
    const baseUrl = getBaseUrl();

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
            ? user.username
            : user.publicId,
        status: user.status,
        role: user.role,
        faculty: user.faculty,
        followCount: Number(user.followCount),
        isFollowedByCurrentUser: user.isFollowedByCurrentUser,
        avatarUrl: user.avatarUrl
            ? `${user.avatarUrl}`
            : null
    }
};

export const adaptFullUserToClient = (user) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastname: user.lastName,
        username: user.username || user.publicId,
        email: user.email,
        role: user.student,
        faculty: user.faculty,
        avatarUrl: user.avatarUrl
            ? `${user.avatarUrl}`
            : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
};

export const adaptUsersToClient = (user) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || user.publicId,
        avatarUrl: user.avatarUrl,
        faculty: user.faculty,
    }
}