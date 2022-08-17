import { Course, CourseInput, CourseOutput, Instructor } from '@/models/index'
import { CourseSchema } from '@/dto'
import { Op } from "sequelize";

export class CourseService {
  private failedOrSuccessRequest(status: string, data?: any) {
    return {
      status,
      data
    }
  }

  async count(limit: number) {
    const course = await Course.count({
      where: {
        is_verified: true
      }
    })
    const totalCourse = {
      totalRows: course,
      totalPage: Math.ceil(course / limit)
    }
    return totalCourse
  }

  async countBySearch(search: string, limit: number) {
    const course = await Course.count({
      where: {
        is_verified: true,
        title: {
          [Op.iLike]: `%${search}%`
        }
      }
    })
    const totalCourse = {
      totalRows: course,
      totalPage: Math.ceil(course / limit)
    }
    return totalCourse
  }

  async createCourse(payload: CourseInput) {
    const result = CourseSchema.safeParse({
      title: payload.title,
      description: payload.description,
      image: payload.image,
    });
    if (!result.success) {
      return this.failedOrSuccessRequest('failed', result.error)
    }
    const course = await Course.create(payload)
    return this.failedOrSuccessRequest('success', course)
  }

  async deleteCourse(id: number) {
    const course = await Course.destroy({
      where: {
        id: id
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course not found')
    } else {
      return this.failedOrSuccessRequest('Success Delete Course', course)
    }
  }

  async getAllCourses(page: number, limit: number) {
    const course = await Course.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course not found')
    }
    return this.failedOrSuccessRequest('success', course)

  }

  async getAllVerifiedCourses(page: number, limit: number) {
    const course = await Course.findAll({
      where: {
        is_verified: true
      },
      offset: (page - 1) * limit,
      limit: limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course not found')
    }
    return this.failedOrSuccessRequest('success', course)

  }

  async getBySearch(search: string, page: number, limit: number): Promise<any> {
    const course = await Course.findAll({
      where: {
        is_verified: true,
        title: {
          [Op.iLike]: `%${search}%`
        }
      },
      offset: (page - 1) * limit,
      limit: limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course not found')
    }
    return this.failedOrSuccessRequest('success', course)
  }

  async getCourseById(id: number) {
    const course = await Course.findByPk(id, {
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }]
    })
    if (course == null) {
      return this.failedOrSuccessRequest('failed', 'Course not found')
    } else {
      return this.failedOrSuccessRequest('success', course)
    }
  }

  async getCourseByInstructorId(id: number): Promise<CourseOutput[]> {
    return await Course.findAll({
      where: {
        instructor_id: id,
      },
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
  }

  async updateCourse(id: number, payload: CourseInput) {
    const result = CourseSchema.safeParse({
      title: payload.title,
      description: payload.description,
      image: payload.image,
    });
    if (!result.success) {
      return this.failedOrSuccessRequest('failed', result.error)
    }
    const course = await Course.update(payload, {
      where: {
        id: id
      },
      returning: true
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', course)
  }

  async verifyCourse(id: number) {
    const course = await Course.update({
      is_verified: true
    }, {
      where: {
        id: id
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', course)
  }

  async rejectCourse(id: number) {
    const course = await Course.update({
      is_verified: false
    }, {
      where: {
        id: id
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', course)
  }


}
