import Post from './post.js';
import Attachment from './attachment.js';
import User from './users.js';
import Like from './like.js'
import Comment from './comment.js'
import Follow from './follow.js';

Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Post.hasMany(Attachment, { foreignKey: 'postId', as: 'attachments' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Attachment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
User.hasMany(Follow, { as: 'followers', foreignKey: 'followeeId' });
User.belongsToMany(User, {
    through: Follow,
    as: 'following',
    foreignKey: 'followerId',
    otherKey: 'followeeId'
});

Follow.belongsTo(User, { as: 'follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'followee', foreignKey: 'followeeId' })