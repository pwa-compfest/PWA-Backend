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
  getCourseByStudentSchema,
  getBySearchSchema,
  idSchema,
  enrollCourseSchema,
  getDetailCourseByStudentSchema
} from '@/dto'
import {
  GetAllCourse,
  GetCourseByInstructor,
  GetCourseByStudent,
  GetDetailCourseByStudent,
  GetBySearch,
  VerifyCourse,
  PublishCourse,
  EnrollCourse
} from '@/common/types/course'
import { Op, Sequelize } from "sequelize"

export class CourseService {

  failedOrSuccessRequest(status: string, code: number, data?: any) {
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

  async countByInstructor(instructorId: number, limit: number) {
    const course = await Course.count({
      where: {
        instructor_id: instructorId
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
        as: 'instructors',
        attributes: ['nip', 'name'],
        duplicating: false
      },
      {
        model: StudentProgress,
        as: 'student_progresses',
        attributes: [],
        duplicating: false
      },
      ],
      attributes: {
        include: [[Sequelize.fn('count', Sequelize.col('student_progresses.id')), 'totalStudent']]
      },
      group: ['courses.id', 'instructors.id']
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
        as: 'instructors',
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
      include: [
        {
          model: Instructor,
          as: 'instructors',
          attributes: ['nip', 'name'],
          duplicating: false
        },
        {
          model: StudentProgress,
          as: 'student_progresses',
          attributes: [],
          duplicating: false
        },
      ],
      attributes: {
        include: [[Sequelize.fn('count', Sequelize.col('student_progresses.id')), 'totalStudent']]
      },
      group: ['courses.id', 'instructors.id']
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
        as: 'instructors',
        attributes: ['nip', 'name']
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getDetailCourseByInstructor(id: number,instructorId: number) {

    const validateArgs = idSchema.safeParse({
      courseId: id
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }
    const course = await Course.findOne({
      where: {
        id : id,
        instructor_id: instructorId
      },
      include: [
        {
          model: Instructor,
          as: 'instructors',
          attributes: ['id', 'nip', 'name']
        },
        {
          model: StudentProgress,
          as: 'student_progresses',
          attributes: [],
          duplicating: false
        },
      ],
      attributes: {
        include: [[Sequelize.fn('count', Sequelize.col('student_progresses.id')), 'totalStudent']]
      },
      group: ['courses.id', 'instructors.id']
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

  async isVerify(payload: VerifyCourse) {

    const validateArgs = idSchema.safeParse({
      courseId: payload.courseId,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    // check if course exist
    const checkCourse = await Course.findByPk(payload.courseId)
    if (!checkCourse) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }

    const is_verified = payload.is_verified === 1 ? 1 : 0
    const course = await Course.update({
      is_verified: is_verified
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

    // check course
    const checkCourse = await Course.findByPk(payload.courseId)
    if (!checkCourse) {
      return this.failedOrSuccessRequest('failed', 400, 'Course Not Found')
    }

    // update is_public
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
      courseId: payload.course_id,
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
        courseId: payload.course_id,
        student_id: payload.student_id
      }
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getCourseByStudent(payload: GetCourseByStudent) {

    const validateArgs = getCourseByStudentSchema.safeParse({
      studentId: payload.studentId,
      page: payload.page,
      limit: payload.limit
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await StudentProgress.findAll({
      where: {
        student_id: payload.studentId
      },
      attributes: ['id', 'courseId', 'student_id'],
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'description', 'image'],
        where: {
          is_verified: 1,
          is_public: true
        },
      }],
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async getDetailCourseByStudent(payload: GetDetailCourseByStudent) {

    const validateArgs = getDetailCourseByStudentSchema.safeParse({
      studentId: payload.studentId,
      courseId: payload.courseId
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const course = await StudentProgress.findOne({
      where: {
        courseId: payload.courseId,
        student_id: payload.studentId
      },
      attributes: ['id', 'courseId', 'student_id'],
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'description', 'image'],
        where: {
          is_verified: 1,
          is_public: true
        },
      }],
    })
    if (!course) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    }
    return this.failedOrSuccessRequest('success', 200, course)
  }

  async countByStudent(id: number, limit: number) {
    const course = await StudentProgress.count({
      where: {
        student_id: id
      }
    })
    const totalCourse = {
      totalRows: course,
      totalPage: Math.ceil(course / limit)
    }
    return totalCourse
  }

  async getCourseById(id: number) {

    const validateArgs = idSchema.safeParse({
      courseId: id
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }
    const course = await Course.findByPk(id)
    if (course == null) {
      return this.failedOrSuccessRequest('failed', 400, 'Course not found')
    } else {
      return this.failedOrSuccessRequest('success', 200, course)
    }
  }


}
