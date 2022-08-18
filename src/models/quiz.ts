import { db } from '@/config';
import { DataTypes, Model, Optional } from 'sequelize'
import { Question } from './question';
import { StudentQuiz } from './studentQuiz';
interface QuizAttributes {
  id: number;
  course_id: number;
  title: string;
  description: string;
  total_questions: number;
}

export interface QuizInput extends Optional<QuizAttributes, 'id'> { }

export interface QuizOutput extends Required<QuizAttributes> { }

interface QuizInstance extends Model<QuizAttributes, QuizInput>,
  QuizAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const Quiz = db.define<QuizInstance>('quizzes', {
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
  description: {
    type: DataTypes.TEXT
  },
  total_questions: {
    type: DataTypes.INTEGER
  },
}, {
  timestamps: true,
})

Quiz.hasMany(StudentQuiz, {
  sourceKey: 'id',
  as: 'student_quizzes'
})

StudentQuiz.belongsTo(Quiz, {
  foreignKey: 'quizId',
  as: 'quizzes'
})

Quiz.hasMany(Question, {
  sourceKey: 'id',
  as: 'questions'
})

Question.belongsTo(Quiz, {
  foreignKey: 'quizId',
  as: 'quizzes'
})

