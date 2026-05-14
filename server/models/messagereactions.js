import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class MessageReaction extends Model { }

MessageReaction.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    messageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Message', key: 'id' },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
    },

    emoji: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'messageReactions',
    modelName: 'MessageReactions',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['messageId', 'userId', 'emoji'],
        },
        { fields: ['messageId'] },
    ],
});

export default MessageReaction;