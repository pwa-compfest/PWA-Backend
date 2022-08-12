import { Model,Optional,DataTypes } from 'sequelize'
import { db } from '../config/database'
import { Course } from './course'

interface InstructorAttributes {
    id: number
    nip: string
    user_id: number
    name: string
    gender : string
    expertise: string
    phone_number: string
    photo: string
    is_verified: boolean
}

interface InstructorCreationAttributes extends Optional<InstructorAttributes, 'id'> {
    expertise: string
    phone_number: string
    photo: string
    is_verified: boolean
}

interface InstructorInstance extends Model<InstructorAttributes, InstructorCreationAttributes>, 
    InstructorAttributes {
        createdAt?: Date
        updatedAt?: Date
    }

export const Instructor = db.define<InstructorInstance>('instructors', 
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : 'users',
        key : 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender : {
      type: DataTypes.STRING,
      allowNull: false
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
  },{
    timestamps: true,
})

// Instructor.hasMany(Course, {
//   foreignKey: 'instructor_id',
//   as: 'courses'
// });

// Course.belongsTo(Instructor, {
//   foreignKey: 'instructor_id',
//   as: 'instructor'
// });
