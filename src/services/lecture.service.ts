import { UpdateLecture } from "@/common/types/lecture"
import { createLectureSchema, deleteLectureSchema, getAllLecturesFromCourseSchema, updateLectureSchema } from "@/dto"
import { Lecture, LectureInput } from "@/models/lecture"

export class LectureService {
  async getAllLecturesFromCourse(courseId: number) {
    // TODO: Validate the data
    const validateArgs = getAllLecturesFromCourseSchema.safeParse({
      courseId,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    // TODO: Get the lectures from database
    const lecturesData = await Lecture.findAll({
      where: {
        course_id: courseId
      },
      attributes: ['id', 'title', 'url']
    })

    return this.failedOrSuccessRequest('success', 200, lecturesData)
  }

  async createLecture(payload: LectureInput[]) {
    // TODO: Validate the data
    const validateArgs = createLectureSchema.safeParse({
      lecturesData: payload
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    try {
      await Lecture.bulkCreate(payload)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    return this.failedOrSuccessRequest('success', 201, {})
  }

  async updateLecture(payload: UpdateLecture) {
    // TODO: Validate the data
    const validateArgs = updateLectureSchema.safeParse({
      lectureId: payload.lectureId,
      courseId: payload.courseId,
      title: payload.title,
      url: payload.url
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    let updateRes
    try {
      updateRes = await Lecture.update({
        title: payload.title,
        url: payload.url
      }, {
        where: {
          id: payload.lectureId,
          course_id: payload.courseId
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    // Check if there is no lecture data
    if (!updateRes[0]) {
      return this.failedOrSuccessRequest('failed', 400, 'Bad Request')
    }

    return this.failedOrSuccessRequest('success', 201, {})
  }

  async deleteLecture(lectureId: number) {
    // Validat the data
    const validateArgs = deleteLectureSchema.safeParse({
      lectureId,
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const dataLecture = await Lecture.findOne({
      where: {
        id: lectureId
      }
    })

    if (!dataLecture) {
      return this.failedOrSuccessRequest('failed', 400, 'Bad Request')
    }

    try {
      await Lecture.destroy({
        where: {
          id: lectureId
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    return this.failedOrSuccessRequest('success', 200, {})
  }

  failedOrSuccessRequest(status: string, code: number, data?: any) {
    return {
      status,
      code,
      data
    }
  }
}