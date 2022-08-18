import { Model, Optional, DataTypes } from 'sequelize'
import { db } from '../config/database'
import { Instructor } from './instructor'
import { Quiz } from './quiz'

interface CourseAttributes {
  id: number
  instructor_id: number
  title: string
  description: string
  image: string
  is_verified: number
  is_public: number
}

export interface CourseInput extends Optional<CourseAttributes, 'id' | 'is_verified' | 'is_public'> { }
export interface CourseOutput extends Required<CourseAttributes> { }

interface CourseInstance extends Model<CourseAttributes, CourseInput>,
  CourseAttributes {
  createdAt?: Date
  updatedAt?: Date
}
export const Course = db.define<CourseInstance>('courses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'instructors',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING
  },
  is_verified: {
    type: DataTypes.INTEGER,
    defaultValue: null,
    allowNull: true,
  },
  is_public: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
})
Course.belongsTo(Instructor, {
  foreignKey: 'instructor_id',
  as: 'instructor'
})