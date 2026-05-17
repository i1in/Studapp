import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Message extends Model { }

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chats', key: 'id' },
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    replyToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'messages', key: 'id' }
    },

    type: {
        type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'sticker', 'system'),
        allowNull: false,
        defaultValue: 'text',
    },

    systemEvent: {
        type: DataTypes.ENUM(
            'user_joined',
            'user_left',
            'member_removed',
            'member_added',
            'chat_created',
            'chat_renamed',
        ),
        allowNull: true,
    },

    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    fileUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    editedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }   
}, {
    sequelize,
    tableName: 'messages',
    modelName: 'Message',
    paranoid: true,
    timestamps: true
})

export default Message;