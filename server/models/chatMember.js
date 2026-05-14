import { Model, DataTypes, DATE } from 'sequelize';
import sequelize from '../config/database';
import Chat from './chat';

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
        references: { model: 'Chat', key: 'id' },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
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
        references: { model: 'Message', key: 'id' },
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