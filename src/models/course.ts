import { Model, Optional, DataTypes } from 'sequelize'
import { db } from '../config/database'
import { Instructor } from './instructor'

interface CourseAttributes {
  id: number
  instructor_id: number
  title: string
  description: string
  image: string
  getSignedUrl: string
  is_verified: number | null
  is_public: boolean
}

export interface CourseInput extends Optional<CourseAttributes, 'id' | 'is_verified' | 'is_public'> { }
export interface CourseOutput extends Required<CourseAttributes> {
}

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
  getSignedUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.SMALLINT,
    defaultValue: null,
    allowNull: true,
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
})


Course.belongsTo(Instructor, {
  foreignKey: 'instructor_id',
  as: 'instructors'
})
