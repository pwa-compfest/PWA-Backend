export interface StudentDetails {
  role: string
  nisn: string
  name: string
  grade: string
  gender: string
  majority: string
  phoneNumber?: string
  photo?: string
}

export interface InstructorDetails {
  role: string
  nip: string
  name: string
  gender: string
  expertise: string
  phoneNumber: string
  photo?: string
}

export interface AdminDetails {
  role: string
}