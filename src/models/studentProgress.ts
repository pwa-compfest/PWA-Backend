import {Model,Optional,DataTypes} from 'sequelize'
import {db} from '../config/database'
import {Course,Student} from './index'

interface StudentProgressAttributes {
    id: number
    courseId: number
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

export const StudentProgress = db.define<StudentProgressInstance>('student_progresses', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    courseId: {
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

Course.hasMany(StudentProgress, {
    sourceKey: 'id',
    as: 'student_progresses'
})

StudentProgress.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'courses'
})
      

StudentProgress.belongsTo(Student, {
    foreignKey: 'student_id',
    as: 'student'
})
