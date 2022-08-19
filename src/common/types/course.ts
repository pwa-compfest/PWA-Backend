export interface GetAllCourse {
    page: number
    limit: number
}

export interface GetCourseByInstructor {
    instructorId: number
    page: number
    limit: number
}

export interface GetCourseByStudent{
    studentId: number
    page: number
    limit: number
}

export interface GetDetailCourseByStudent{
    studentId: number
    courseId: number
}

export interface GetBySearch {
    search: string
    page: number
    limit: number
}

export interface VerifyCourse {
    courseId: number
    is_verified: number
}

export interface PublishCourse {
    courseId: number
    setPublic: boolean
}

export interface EnrollCourse {
    course_id: number
    student_id: number
}
