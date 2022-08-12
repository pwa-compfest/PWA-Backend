import { db } from "@/config";
import { DataTypes, Model } from "sequelize";

export interface StudentModel extends Model<StudentModel, StudentAddModel> {
  id: number
  nisn: string
  user_id: number
  name: string
  grade: string
  gender: string
  majority: string
  phone_number?: string
  photo?: string
  createdAt: Date
  updatedAt: Date
}

export interface StudentAddModel {
  id?: number
  nisn: string
  user_id: number
  name: string
  grade: string
  gender: string
  majority: string
  phone_number?: string
  photo?: string
  createdAt?: Date
  updatedAt?: Date
}

export const Student = db.define<StudentModel, StudentAddModel>('students', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nisn: {
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
  grade: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.STRING
  },
  majority: {
    type: DataTypes.STRING
  },
  phone_number: {
    type: DataTypes.STRING
  },
  photo: {
    allowNull: true,
    type: DataTypes.STRING
  },
}, {
  timestamps: true
})