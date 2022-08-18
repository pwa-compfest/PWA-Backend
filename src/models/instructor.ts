import { DataTypes, Model } from 'sequelize'
import { db } from '@/config'


export interface InstructorModel extends Model<InstructorModel, InstructorAddModel> {
  id: number
  nip: string
  user_id: number
  name: string
  gender: string
  expertise: string
  phone_number: string
  photo?: string
  is_verified?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface InstructorAddModel {
  id?: number
  nip: string
  user_id: number
  name: string
  gender: string
  expertise: string
  phone_number: string
  photo?: string
  is_verified?: number
  createdAt?: Date
  updatedAt?: Date
}

export const Instructor = db.define<InstructorModel, InstructorAddModel>('instructors', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nip: {
    type: DataTypes.STRING
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.STRING
  },
  expertise: {
    type: DataTypes.STRING
  },
  phone_number: {
    type: DataTypes.STRING
  },
  photo: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  is_verified: {
    allowNull: true,
    defaultValue: null,
    type: DataTypes.TINYINT
  }
}, {
  timestamps: true
})