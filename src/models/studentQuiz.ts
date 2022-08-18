import { db } from '@/config';
import { DataTypes, Model, Optional } from 'sequelize'

interface StudentQuizAttributes {
  id: number;
  student_id: number;
  quizId: number;
  question_data: Record<number, {
    studentAnswer: string,
    rightAnswer: string
  }>;
  quiz_result: number;
  highest_score: number;
}

export interface StudentQuizInput extends Optional<StudentQuizAttributes, 'id'> { }

export interface StudentQuizOutput extends Required<StudentQuizAttributes> { }

interface StudentQuizInstance extends Model<StudentQuizAttributes, StudentQuizInput>,
  StudentQuizAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const StudentQuiz = db.define<StudentQuizInstance>('student_quizzes', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  quizId: {
    type: DataTypes.INTEGER,
  },
  question_data: {
    type: DataTypes.JSON
  },
  quiz_result: {
    type: DataTypes.INTEGER
  },
  highest_score: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true,
})

