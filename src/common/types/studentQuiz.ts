export interface CreateStudentQuiz {
  quizId: number;
  studentId: number;
  questionData: {
    questionId: number,
    studentAnswer: "A" | "B" | "C" | "D"
  }[];
}

export interface RightAnswer {
  [key: number]: "A" | "B" | "C" | "D"
}