import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


class Post extends Model { }


Post.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true
});

export default Post;
