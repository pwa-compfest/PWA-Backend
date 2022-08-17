import {Model,Optional,DataTypes} from 'sequelize'
import {db} from '../config/database'
import {Course,Student} from './index'

interface StudentProgressAttributes {
    id: number
    course_id: number
    student_id: number
    visited_lecture: any
}

export interface StudentProgressInput extends Optional<StudentProgressAttributes, 'id'|'visited_lecture'> {}
export interface StudentProgressOutput extends Required<StudentProgressAttributes> {}

interface StudentProgressInstance extends Model<StudentProgressAttributes, StudentProgressInput>,
    StudentProgressAttributes {
        createdAt?: Date
        updatedAt?: Date
    }

export const StudentProgress = db.define<StudentProgressInstance>('student_progress', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    course_id: {
        type: DataTypes.INTEGER,
        references : {
            model : 'courses',
            key : 'id'
        }
    },
    student_id: {
        type: DataTypes.INTEGER,
        references : {
            model : 'students',
            key : 'id'
        }
    },
    visited_lecture: {
        type: DataTypes.JSONB
    },
},{
    timestamps: true,
})

StudentProgress.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
})

StudentProgress.belongsTo(Student, {
    foreignKey: 'student_id',
    as: 'student'
})
