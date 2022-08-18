import {
  Course,
  CourseInput,
  Instructor,
  StudentProgress
} from '@/models/index'
import {
  courseSchema,
  getAllCourseSchema,
  deleteCourseSchema,
  getCourseByInstructorSchema,
  getBySearchSchema,
  idSchema,
  enrollCourseSchema
} from '@/dto'
import {
  GetAllCourse,
  GetCourseByInstructor,
  GetBySearch,
  VerifyCourse,
  PublishCourse,
  EnrollCourse
} from '@/common/types/course'
import {Op} from "sequelize"

export class CourseService {

  failedOrSuccessRequest(status: string, code: number, data ? : any) {
    return {
      status,
      code,
      data
    }
  }

  async count(limit: number) {
    const course = await Course.count({
      where: {
        is_verified: 1,
        is_public: true
      }
    })

    const totalCourse = {
      totalRows: course,
      totalPage: Math.ceil(course / limit)
    }

    return totalCourse
  }

  async countByInstructor(id: number, limit: number) {
    const course = await Course.count({
      where: {
        instructor_id: id
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
        is_verified: 1,
        is_public: true,
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
    const validateArgs = courseSchema.safeParse({
      title: payload.title,
      description: payload.description,
      image: payload.image,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.create(payload)
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async deleteCourse(id: number) {

    const validateArgs = deleteCourseSchema.safeParse({
      courseId: id,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    try {
      await Course.destroy({
        where: {
          id: id
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    return this.failedOrSuccessRequest('success', 200)
  }

  async getAllCourses(payload: GetAllCourse) {

    const validateArgs = getAllCourseSchema.safeParse({
      page: payload.page,
      limit: payload.limit
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.findAll({
      where: {
        is_verified: 1,
        is_public: true
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getUnverifiedCourse(payload: GetAllCourse) {

    const validateArgs = getAllCourseSchema.safeParse({
      page: payload.page,
      limit: payload.limit
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.findAll({
      where: {
        is_verified: null
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getCourseByInstructor(payload: GetCourseByInstructor) {


    const validateArgs = getCourseByInstructorSchema.safeParse({
      instructorId: payload.instructorId,
      page: payload.page,
      limit: payload.limit
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.findAll({
      where: {
        instructor_id: payload.instructorId
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getBySearch(payload: GetBySearch) {

    const validateArgs = getBySearchSchema.safeParse({
      search: payload.search,
      page: payload.page,
      limit: payload.limit
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.findAll({
      where: {
        is_verified: true,
        title: {
          [Op.iLike]: `%${payload.search}%`
        }
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getCourseById(id: number) {

    const validateArgs = idSchema.safeParse({
      courseId: id
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.findByPk(id, {
      include: [{
        model: Instructor,
        as: 'instructor',
        attributes: ['nip', 'name']
      }]
    })
    if (course == null) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    } else {
      return this.failedOrSuccessRequest('success', 200, course)
    }
  }


  async updateCourse(id: number, payload: CourseInput) {

    const validateArgs = courseSchema.safeParse({
      title: payload.title,
      description: payload.description,
      image: payload.image,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.update(payload, {
      where: {
        id: id
      },
      returning: true
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async verifyCourse(payload: VerifyCourse) {

    const validateArgs = idSchema.safeParse({
      id: payload.courseId,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.update({
      is_verified: 1
    }, {
      where: {
        id: payload.courseId
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async rejectCourse(payload: VerifyCourse) {

    const validateArgs = idSchema.safeParse({
      id: payload.courseId,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.update({
      is_verified: 0
    }, {
      where: {
        id: payload.courseId
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }


  async isPublic(payload: PublishCourse) {

    const validateArgs = idSchema.safeParse({
      courseId: payload.courseId,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await Course.update({
      is_public: payload.setPublic === true ? true : false
    }, {
      where: {
        id: payload.courseId
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async enrollCourse(payload: EnrollCourse) {
    
    const validateArgs = enrollCourseSchema.safeParse({
      courseId: payload.course_id,
      studentId: payload.student_id,
    });
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await StudentProgress.create({
      course_id: payload.course_id,
      student_id: payload.student_id
    })
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async checkEnroll(payload: EnrollCourse) {

    const validateArgs = enrollCourseSchema.safeParse({
      courseId: payload.course_id,
      studentId: payload.student_id,
    });
    
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await StudentProgress.findOne({
      where: {
        course_id: payload.course_id,
        student_id: payload.student_id
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getCourseByStudent(id: number, page: number, limit: number) {
    const course = await StudentProgress.findAll({
      where: {
        student_id: id
      },
      offset: (page - 1) * limit,
      limit: limit,
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'description', 'image']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

}