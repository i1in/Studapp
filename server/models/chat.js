import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Chat extends Model { }

Chat.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    type: {
        type: DataTypes.ENUM('direct', 'group', 'channel'),
        allowNull: false,
        defaultValue: 'direct',
    },

    // для групп или каналов
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    lastMessageId: {
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: { model: 'messages', key: 'id' },
    }
}, {
    sequelize,
    tableName: 'chats',
    modelName: 'Chat',
    timestamps: true
})

export default Chat;