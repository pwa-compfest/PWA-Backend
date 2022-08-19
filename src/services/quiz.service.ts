import { CreateQuiz, GetAllQuizFromCourse, GetSingleQuiz, UpdateQuiz } from "@/common/types/quiz";
import { createQuizSchema, deleteQuizSchema, getAllQuizFromCourseSchema, getSingleQuizSchema, updateQuizSchema } from "@/dto";
import { Course, Question, QuestionInput, Quiz, QuizOutput } from "@/models";
import { StudentQuiz } from "@/models/studentQuiz";

export class QuizService {
  async getAllQuizFromCourse(paylod: GetAllQuizFromCourse) {
    // Velidate the payload
    const validateArgs = getAllQuizFromCourseSchema.safeParse({
      courseId: paylod.courseId,
      role: paylod.role
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    let quizesData

    if (paylod.role === 'STUDENT') {
      quizesData = await Quiz.findAll({
        where: {
          course_id: paylod.courseId
        },
        include: [{
          model: StudentQuiz,
          as: 'student_quizzes',
          attributes: ['quiz_result', 'highest_score']
        }],
      })
    } else {
      quizesData = await Quiz.findAll({
        where: {
          course_id: paylod.courseId
        },
      })
    }

    return this.failedOrSuccessRequest('success', 200, quizesData)
  }

  async getSingleQuiz(payload: GetSingleQuiz) {
    // Validate the payload
    const validateArgs = getSingleQuizSchema.safeParse({
      quizId: payload.quizId,
      courseId: payload.courseId,
      role: payload.role
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    let quizData: any
    if (payload.role === 'STUDENT') {
      quizData = await Quiz.findOne({
        where: {
          id: payload.quizId
        },
        attributes: ['title', 'description', ['total_questions', 'totalQuestions']],
        include: [{
          model: Question,
          as: 'questions',
          attributes: ['id', 'question', 'answer']
        }]
      })
    } else {
      quizData = await Quiz.findOne({
        where: {
          id: payload.quizId,
        },
        attributes: ['title', 'description'],
        include: [{
          model: Question,
          as: 'questions',
          // attributes: ['question', 'answer', 'asnwer_right']
        }]
      })
    }
    // Get the course name
    const courseData = await Course.findOne({
      where: {
        id: payload.courseId
      }
    })

    if (!quizData) {
      return this.failedOrSuccessRequest('failed', 400, 'Bad Request')
    }

    quizData.dataValues.courseTitle = courseData ? courseData.title : null

    return this.failedOrSuccessRequest('success', 200, quizData)
  }

  async createQuiz(payload: CreateQuiz) {
    // Validate the payload
    const validateArgs = createQuizSchema.safeParse({
      courseId: payload.courseId,
      title: payload.title,
      description: payload.description,
      questions: payload.questions
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    let createQuizResult: QuizOutput
    try {
      createQuizResult = await Quiz.create({
        course_id: payload.courseId,
        title: payload.title,
        description: payload.description,
        total_questions: payload.questions.length,
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    // Looping for assigning the quiz_id
    payload.questions.map((question: any) => {
      question['quizId'] = createQuizResult.id
    })

    try {
      await Question.bulkCreate(payload.questions as QuestionInput[])
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    return this.failedOrSuccessRequest('success', 201, {})
  }

  async updateQuiz(payload: UpdateQuiz) {
    // Validate the payload
    const validateArgs = updateQuizSchema.safeParse({
      courseId: payload.courseId,
      quizId: payload.quizId,
      title: payload.title,
      description: payload.description,
      questions: payload.questions
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    // Update quiz
    try {
      await Quiz.update({
        title: payload.title,
        description: payload.description,
      }, {
        where: {
          id: payload.quizId,
          course_id: payload.courseId
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    // Update questions
    try {
      await Question.bulkCreate(payload.questions as QuestionInput[], {
        updateOnDuplicate: ['question', 'answer', 'answer_right']
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 500, error)
    }

    return this.failedOrSuccessRequest('success', 201, {})
  }

  async deleteQuiz(quizId: number) {
    // Validate the data
    const validateArgs = deleteQuizSchema.safeParse({
      quizId
    })

    try {
      await Quiz.destroy({
        where: {
          id: quizId
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