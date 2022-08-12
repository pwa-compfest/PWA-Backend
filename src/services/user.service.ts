import { User, UserModel, UserAddModel, UserViewModel } from '../models/user'

export class UserService {
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
}