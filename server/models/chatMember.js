import { Model, DataTypes, DATE } from 'sequelize';
import sequelize from '../config/database.js';

class ChatMember extends Model {}

ChatMember.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'chats', key: 'id' },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },

    role: {
        type: DataTypes.ENUM('owner', 'admin', 'member'),
        allowNull: false,
        defaultValue: 'member',
    },

    mutedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    lastReadMessageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'messages', key: 'id' },
    },

    joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    leftAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'chatmember',
    modelName: 'ChatMember',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['chatId', 'userId'] },
    ]
});

export default ChatMember;