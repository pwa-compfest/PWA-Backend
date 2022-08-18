import { CreateStudentQuiz } from "@/common/types/studentQuiz";
import { createStudentQuizSchema } from "@/dto";
import { Question, Quiz, StudentQuiz } from "@/models";

export class StudentQuizService {
  async createStudentQuiz(payload: CreateStudentQuiz) {
    // Validate the payload
    const validateArgs = createStudentQuizSchema.safeParse({
      quizId: payload.quizId,
      studentId: payload.studentId,
      questionData: payload.questionData
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    // Calculate quiz_result
    // 1. Get the right answer from quiz
    const quizData: any = await Quiz.findOne({
      where: {
        id: payload.quizId
      },
      attributes: [],
      include: [{
        model: Question,
        as: 'questions',
        attributes: ['id', ['answer_right', 'answerRight'], 'question', 'answer']
      }]
    })
    // 2, Format the quizData
    if (!quizData) {
      return this.failedOrSuccessRequest('failed', 400, 'Bad Request')
    }
    const rightAnswer: Record<number, "A" | "B" | "C" | "D"> = {}
    quizData.questions.map((question: any) => {
      rightAnswer[question.dataValues.id] = question.dataValues.answerRight
    })
    // 3. Compare student answer and the right answer
    let totalScoreTemp = 0
    const studentAnswerData: Record<number, string> = {}
    payload.questionData.map((studentAnswer) => {
      studentAnswerData[studentAnswer.questionId] = studentAnswer.studentAnswer
      if (rightAnswer[studentAnswer.questionId] === studentAnswer.studentAnswer) {
        totalScoreTemp++
      }
    })
    // 4. Reformat the score
    const quizResult = Math.floor(totalScoreTemp / quizData.questions.length * 100)
    // 5. Format the question_data
    const questionData: Record<number, {
      studentAnswer: string,
      rightAnswer: string
    }> = {}
    for (let i = 0; i < quizData.questions.length; i++) {
      questionData[quizData.questions[i].dataValues.id] = {
        studentAnswer: studentAnswerData[quizData.questions[i].dataValues.id],
        rightAnswer: quizData.questions[i].dataValues.answerRight
      }
    }

    // TODO: Quiz get 100 score add student progress

    // Check if the studentQuiz already exist
    const studentQuizData = await StudentQuiz.findOne({
      where: {
        quizId: payload.quizId,
        student_id: payload.studentId
      }
    })


    // Save the result to database
    if (!studentQuizData) {
      try {
        await StudentQuiz.create({
          student_id: payload.studentId,
          quizId: payload.quizId,
          question_data: questionData,
          quiz_result: quizResult,
          highest_score: quizResult,
        })
      } catch (error) {
        return this.failedOrSuccessRequest('failed', 500, error)
      }
    } else {
      try {
        await StudentQuiz.update({
          question_data: questionData,
          quiz_result: quizResult,
          highest_score: Math.max(studentQuizData.highest_score, quizResult)
        }, {
          where: {
            quizId: payload.quizId,
            student_id: payload.studentId
          }
        })
      } catch (error) {
        return this.failedOrSuccessRequest('failed', 500, error)
      }
    }

    return this.failedOrSuccessRequest('success', 201, { quizData, answerData: questionData, quizResult })
  }

  failedOrSuccessRequest(status: string, code: number, data?: any) {
    return {
      status,
      code,
      data
    }
  }
}