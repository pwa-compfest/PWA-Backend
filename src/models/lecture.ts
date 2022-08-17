import { db } from "@/config";
import { DataTypes, Model, Optional } from "sequelize";
import { Course } from "./course";

interface LectureAttributes {
  id: number,
  course_id: number,
  title: string,
  url: string,
}


// Define the optional input from Lecture model
export interface LectureInput extends Optional<LectureAttributes, 'id'> { }

export interface LectureOutput extends Required<LectureAttributes> { }

interface LectureInstance extends Model<LectureAttributes, LectureInput>, LectureAttributes {
  createdAt?: Date
  updatedAt?: Date
}

export const Lecture = db.define<LectureInstance>('lectures', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.TEXT
  },
}, {
  timestamps: true,
})

Lecture.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course'
})