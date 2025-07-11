import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Follow extends Model {}

Follow.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  followeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
}, {
  sequelize,
  modelName: 'Follow',
  tableName: 'follows',
  timestamps: true,
  indexes: [{
    unique: true,
    fields: ['followerId', 'followeeId']
  }]
});

export default Follow;
