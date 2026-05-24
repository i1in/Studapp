import Post from './post.js';
import Attachment from './attachment.js';
import User from './users.js';
import Like from './like.js'
import Comment from './comment.js'
import Follow from './follow.js';
import Chat from './chat.js';
import Message from './message.js';
import MessageAttachment from './messageattachments.js';
import MessageReaction from './messagereactions.js';
import ChatMember from './chatMember.js';

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
User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });
User.hasMany(MessageReaction, { foreignKey: 'userId', as: 'reactions' });
User.hasMany(ChatMember, { foreignKey: 'userId', as: 'memberships' });
User.belongsToMany(Chat, {
    through: ChatMember,
    foreignKey: 'userId',
    as: 'chats',
});
User.belongsToMany(User, {
    through: Follow,
    as: 'following',
    foreignKey: 'followerId',
    otherKey: 'followeeId'
});

Follow.belongsTo(User, { as: 'follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'followee', foreignKey: 'followeeId' });

Chat.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Chat.belongsTo(Message, { foreignKey: 'lastMessageId', as: 'lastMessage' });
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Chat.hasMany(ChatMember, { foreignKey: 'chatId', as: 'members' });
Chat.hasMany(ChatMember, { foreignKey: 'chatId', as: 'allMembers' });
Chat.belongsToMany(User, {
    through: ChatMember,
    foreignKey: 'chatId',
    as: 'users',
});

Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.hasMany(MessageAttachment, { foreignKey: 'messageId', as: 'attachments' });
Message.hasMany(MessageReaction, { foreignKey: 'messageId', as: 'reactions' });
// reply
Message.belongsTo(Message, { foreignKey: 'replyToId', as: 'replyTo' });
Message.hasMany(Message, { foreignKey: 'replyToId', as: 'replies' });

MessageAttachment.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });

MessageReaction.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });
MessageReaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ChatMember.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
ChatMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ChatMember.belongsTo(Message, { foreignKey: 'lastReadMessageId', as: 'lastReadMessage' });

