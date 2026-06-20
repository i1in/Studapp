import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 16]
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 16]
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            len: [1, 30],
            is: /^[a-zA-Z0-9_]{3,30}$/
        }
    },
    publicId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin'),
        allowNull: false,
        defaultValue: 'student',
    },
    faculty: {
        type: DataTypes.ENUM(
            'ivmiit',    // Институт вычислительной математики и информационных технологий
            'itis',      // Институт информационных технологий и интеллектуальных систем
            'iir',       // Институт международных отношений
            'imef',      // Институт управления, экономики и финансов
            'ifmb',      // Институт фундаментальной медицины и биологии
            'ignt',      // Институт геологии и нефтегазовых технологий
        ),
        allowNull: true,
    },
    onlineStatus: {
        type: DataTypes.STRING(15),
        defaultValue: 'online',
    },
    isOnlineHidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lastSeenAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'users',
    modelName: 'User',
    sequelize,
    timestamps: true,
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] }
    ]
});

User.afterCreate(async (user, options) => {
    const publicId = 'user' + user.id;
    await user.update({ publicId }, { transaction: options.transaction });
});

export default User;