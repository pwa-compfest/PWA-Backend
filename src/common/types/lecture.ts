export interface CreateLecture {
  courseId: number;
  title: string;
  url: string;
}

export interface UpdateLecture {
  lectureId: number;
  courseId: number;
  title: string;
  url: string;
}