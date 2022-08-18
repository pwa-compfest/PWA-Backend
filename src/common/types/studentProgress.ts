export interface AddStudentProgress {
  courseId: number;
  lectureId: number;
  studentId: number;
}

export interface GetStudentProgress {
  courseId: number;
  studentId: number;
}