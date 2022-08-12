import { Course,CourseInput,CourseOutput } from '@/models/index'
import { CourseSchema } from '@/dto'

export class CourseService {

    async getAllCourses(): Promise<CourseOutput[]> {
        return await Course.findAll({
            where:{
                is_verified: true
            },
            attributes: ['id', 'instructor_id', 'title', 'description', 'image', 'is_verified']
        })
    }

    async getCourseByInstructorId(id: number): Promise<CourseOutput[]> {
        return await Course.findAll({
            where:{
                instructor_id: id,
            },
            attributes: ['id', 'instructor_id', 'title', 'description', 'image', 'is_verified']
        })
    }

    async searchCourse(query: string): Promise<CourseOutput[]> {
        return await Course.findAll({
            where:{
                title: {
                    // [Op.like]: `%${query}%`
                },
                is_verified: true
            },
            attributes: ['id', 'instructor_id', 'title', 'description', 'image', 'is_verified']
        })
    }
    
    async createCourse(payload: CourseInput): Promise<CourseOutput> {
        const result = CourseSchema.safeParse({
            ...payload,
        });
        const course = await Course.create(payload)
        return {
            id: course.id,
            instructor_id: course.instructor_id,
            title: course.title,
            description: course.description,
            image: course.image,
            is_verified: course.is_verified,
        }
    }
}