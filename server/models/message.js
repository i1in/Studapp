import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

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
        references: { model: 'Chat', key: 'id' },
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' }
    },
    replyToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Message', key: 'id' }
    },

    type: {
        type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'sticker'),
        allowNull: false,
        defaultValue: 'text',
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