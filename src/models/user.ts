import { Model, DataTypes } from 'sequelize';
import { db } from '../config/database';

export interface UserAddModel {
  id: number
  email: string
  password: string
  refresh_token?: string
  role: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserModel extends Model<UserModel, UserAddModel> {
  id: number
  email: string
  password: string
  refresh_token: string
  role: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserViewModel {
  id: number
  email: string
  role: string
}

export const User = db.define<UserModel, UserAddModel>('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});
