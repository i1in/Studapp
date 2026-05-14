import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class MessageAttachment extends Model { }

MessageAttachment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Message', key: 'id' },
    },

    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // для изображений
    width: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    sequelize,
    tableName: 'messageAttachments',
    modelName: 'MessageAttachment',
    timestamps: true,
    indexes: [
        { fields: ['messageId'] },
    ]
});

export default MessageAttachment;