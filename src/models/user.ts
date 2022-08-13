import { Model, DataTypes } from 'sequelize'
import { db } from '../config/database'

export interface UserAddModel {
  id?: number
  email: string
  is_verified?: number
  password: string
  refresh_token?: string
  role: string
  has_session?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface UserModel extends Model<UserModel, UserAddModel> {
  id?: number
  email: string
  is_verified: number
  password: string
  refresh_token: string
  role: string
  has_session: number
  createdAt?: Date
  updatedAt?: Date
}

export interface UserViewModel {
  id?: number
  email: string
  role: string
}

export interface UserVerificationTokenAddModel {
  id?: number
  user_id: number
  expires: Date
  hashed_token: string
}
export interface UserVerificationTokenModel extends Model<UserVerificationTokenModel, UserVerificationTokenAddModel> {
  id?: number
  user_id: number
  expires: Date
  hashed_token: string
}

export interface ChangePasswordTokenAddModel {
  id?: number
  user_id: number
  expires: Date
  hashed_token: string
}
export interface ChangePasswordTokenModel extends Model<ChangePasswordTokenModel, ChangePasswordTokenAddModel> {
  id?: number
  user_id: number
  expires: Date
  hashed_token: string
}

export const User = db.define<UserModel, UserAddModel>('users', {
  id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  is_verified: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  has_session: {
    defaultValue: 0,
    allowNull: false,
    type: DataTypes.INTEGER
  },
}, {
  timestamps: true,
})

export const UserVerificationToken = db.define<UserVerificationTokenModel, UserVerificationTokenAddModel>('user_verification_tokens', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hashed_token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false
})

export const ChangePasswordToken = db.define<ChangePasswordTokenModel, ChangePasswordTokenAddModel>('change_password_tokens', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hashed_token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false
})