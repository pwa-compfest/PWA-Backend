export interface GetAllQuizFromCourse {
  courseId: number;
  role: string;
}

export interface GetSingleQuiz {
  quizId: number;
  courseId: number;
  role: string;
}

export interface CreateQuiz {
  courseId: number,
  title: string,
  description: string,
  questions: object[]
}

export interface UpdateQuiz {
  courseId: number,
  quizId: number,
  title: string,
  description: string,
  questions: object[]
}
