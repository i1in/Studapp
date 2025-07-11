import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Post from './post.js';
import User from './users.js'


class Like extends Model { }

Like.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['postId', 'userId']
        }
    ]
});

export default Like;
