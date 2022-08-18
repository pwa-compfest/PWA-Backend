import { db } from '@/config';
import { DataTypes, Model, Optional } from 'sequelize'
interface QuestionAttributes {
  id: number;
  quizId: number;
  question: string;
  answer: object;
  answer_right: string;
}

export interface QuestionInput extends Optional<QuestionAttributes, 'id'> { }

export interface QuestionOutput extends Required<QuestionAttributes> { }

interface QuestionInstance extends Model<QuestionAttributes, QuestionInput>,
  QuestionAttributes {
  createdAt?: Date
  updatedAT?: Date
}

export const Question = db.define<QuestionInstance>('questions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  quizId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: 'quizzes',
    //   key: 'id'
    // }
  },
  question: {
    type: DataTypes.TEXT
  },
  answer: {
    type: DataTypes.JSON
  },
  answer_right: {
    type: DataTypes.STRING
  },
}, {
  timestamps: true
})

