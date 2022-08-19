import { Instructor } from '@/models/index'
import { verifyInstructor } from '@/common/types/instructor'
import { verifyInstructorSchema } from '@/dto/instructor.dto'
export class InstructorService {

  private failedOrSuccessRequest(status: string, code: number, data?: any) {
    return {
      status,
      code,
      data
    }
  }

  async getInstructor(page: number, limit: number) {
    const instructor = await Instructor.findAll({
      where: {
        is_verified: null
      },
      offset: (page - 1) * limit,
      limit: limit,
    })
    if (!instructor) {
      return this.failedOrSuccessRequest('failed', 400, 'Instructor not found')
    }
    return this.failedOrSuccessRequest('success', 200, instructor)
  }

  async count(limit: number) {
    const instructor = await Instructor.count({
      where: {
        is_verified: null
      }
    })
    const totalInstructor = {
      totalRows: instructor,
      totalPage: Math.ceil(instructor / limit)
    }
    return totalInstructor
  }

  async isVerify(payload: verifyInstructor) {

    const validateArgs = verifyInstructorSchema.safeParse({
      id: payload.instructorId,
      is_verified: payload.is_verified
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    // Check Instructor
    const checkInstructor = await Instructor.findByPk(payload.instructorId)
    if (!checkInstructor) {
      return this.failedOrSuccessRequest('failed', 400, 'Instructor not found')
    }

    // Update instructor
    const is_verified = payload.is_verified === 1 ? 1 : 0
    const instructor = await Instructor.update({
      is_verified: is_verified
    }, {
      where: {
        id: payload.instructorId
      },
      returning: true
    })
    if (!instructor) {
      return this.failedOrSuccessRequest('failed', 400, 'Update instructor failed')
    }
    return this.failedOrSuccessRequest('success', 200, instructor)
  }

}
