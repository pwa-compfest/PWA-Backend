import { Model,Optional,DataTypes } from 'sequelize'
import { db } from '../config/database'
import { Instructor } from './instructor'

interface CourseAttributes {
    id: number
    instructor_id: number
    title: string
    description: string
    image: string
    is_verified: boolean
}

export interface CourseInput extends Optional<CourseAttributes, 'id'> {}
export interface CourseOutput extends Required<CourseAttributes> {}

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
        references : {
          model : 'instructors',
          key : 'id'
        }
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      image : {
        type: DataTypes.STRING
      },
      is_verified: {
          type: DataTypes.BOOLEAN
      },
},{
    timestamps: true,
})