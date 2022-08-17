import { User, UserViewModel, UserAddModel, Instructor, Student } from '@/models'

export class UserService {
  async addUser(user: UserAddModel): Promise<UserViewModel> {
    const newUser = await User.create(user)
    return {
      id: newUser.id as number,
      email: newUser.email,
      role: newUser.role,
    }
  }

  async deleteUser(id: string): Promise<void> {
    await User.destroy({
      where: {
        id,
      },
    })
  }

  async getAllUsers(): Promise<UserViewModel[]> {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role'],
    })
    return users.map((user) => {
      return {
        id: user.id as number,
        email: user.email,
        role: user.role,
      }
    })
  }

  async getUserById(id: string): Promise<UserViewModel> {
    const user = await User.findOne({
      where: {
        id,
      },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return {
      id: user.id as number,
      email: user.email,
      role: user.role,
    }
  }

  async updateUser(id: string, user: UserAddModel): Promise<UserViewModel> {
    const updatedUser = await User.update(user, {
      where: {
        id,
      },
    })
    if (!updatedUser) {
      throw new Error('User not found')
    }
    return {
      id: user.id as number,
      email: user.email,
      role: user.role,
    }
  }

  async getInstructorData(userId: number) {
    const instructorData = await Instructor.findOne({
      where: {
        user_id: userId
      },
      attributes: ['nip', 'name', 'gender', 'expertise', ['phone_number', 'phoneNumber'], 'photo', ['is_verified', 'isVerified']]
    })

    return this.failedOrSuccessRequest('success', 200, instructorData)
  }

  async getStudentData(userId: number) {
    const studentData = await Student.findOne({
      where: {
        user_id: userId,
      },
      attributes: ['nisn', 'name', 'grade', 'gender', 'majority', ['phone_number', 'phoneNumber'], 'photo']
    })

    return this.failedOrSuccessRequest('success', 200, studentData)
  }

  failedOrSuccessRequest(status: string, code: number, data?: any) {
    return {
      status,
      code,
      data
    }
  }
}