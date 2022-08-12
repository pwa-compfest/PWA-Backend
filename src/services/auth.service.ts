import { InstructorDetails, StudentDetails, AdminDetails } from '@/common/types/user';
import { signInSchema, signUpSchema } from '@/dto';
import { Instructor } from '@/models/instructor';
import { Student } from '@/models/student';
import { User, UserVerificationToken } from '@/models/user';
import { signJWT } from '@/utils/jwt';
import argon2 from 'argon2'
import { createTransport } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'
export class AuthService {
  async signUp(email: string, password: string, confirmPassword: string, data: AdminDetails | InstructorDetails | StudentDetails) {
    // validate the data
    const result = signUpSchema.safeParse({
      email,
      password,
      confirmPassword,
      data
    });

    if (!result.success) {
      return this.failedOrSuccessRequest('failed', result.error.format())
    }

    // TODO: Create the user and save it to db
    const hashedPassword = await this.hashData(password)
    let user
    try {
      user = await User.create({
        email,
        password: hashedPassword,
        role: data.role,
        // is_verified: 0
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    // TODO: Create the userVerificationToken to database
    const userVerificationToken = uuidv4() + '-' + uuidv4();
    let resultUVTReq
    try {
      const expiresTime = 15 * 60 * 1000 // 15 minutes
      const hashedUserVerificationToken = await this.hashData(userVerificationToken)
      resultUVTReq = await UserVerificationToken.create({
        expires: new Date(new Date().getTime() + expiresTime),
        hashed_token: hashedUserVerificationToken,
        user_id: user.id as number
      })
    } catch (error) {
      await User.destroy({
        where: {
          id: user.id
        }
      })
      return this.failedOrSuccessRequest('failed', error)
    }

    // Create Admin | Instructor | Student credentials
    let resultCreateDetails
    try {
      if (data.role === 'INSTRUCTOR') {
        const instructorData = data as InstructorDetails
        resultCreateDetails = await Instructor.create({
          nip: instructorData.nip,
          user_id: user.id as number,
          name: instructorData.name,
          gender: instructorData.gender,
          expertise: instructorData.expertise,
          phone_number: instructorData.phoneNumber,
          photo: instructorData.photo
        })
      }

      if (data.role === 'STUDENT') {
        const studentData = data as StudentDetails
        resultCreateDetails = await Student.create({
          nisn: studentData.nisn,
          user_id: user.id as number,
          name: studentData.name,
          grade: studentData.grade,
          gender: studentData.gender,
          majority: studentData.majority,
          phone_number: studentData.phoneNumber,
          photo: studentData.photo
        })
      }
    } catch (error) {
      await UserVerificationToken.destroy({
        where: {
          id: resultUVTReq.id
        }
      })
      await User.destroy({
        where: {
          id: user.id
        }
      })
      return this.failedOrSuccessRequest('failed', error)
    }

    // TODO: Create transporter for nodemailer
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
      }
    })

    // TODO: Set the nodemailer config
    const mailOptions = {
      to: user.email,
      subject: 'Perwibuan LMS Account Verification',
      html: `${userVerificationToken}`
    }
    // TODO: Send the account verification email to the user
    let sendMailError;
    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        sendMailError = error
      }
    })

    if (sendMailError) {
      await UserVerificationToken.destroy({
        where: {
          id: resultUVTReq.id
        }
      })
      if (data.role === 'INSTRUCTOR' && resultCreateDetails) {
        await Instructor.destroy({
          where: {
            id: resultCreateDetails.id
          }
        })
      }
      if (data.role === 'STUDENT' && resultCreateDetails) {
        await Student.destroy({
          where: {
            id: resultCreateDetails.id
          }
        })
      }
      await User.destroy({
        where: {
          id: user.id
        }
      })
      return this.failedOrSuccessRequest('failed', sendMailError)
    }

    return this.failedOrSuccessRequest('success', resultCreateDetails)
  }

  async verifyAccount(token: string, userId: number) {
    // TODO: Get the current user data for making the token later
    const user = await User.findOne({
      where: {
        id: userId
      },
    })

    if (!user) {
      return this.failedOrSuccessRequest('failed', 'Failed to get the user')
    }

    // TODO: Check if the token with the current email is exist or not
    const hashedUserVerificationToken = await UserVerificationToken.findOne({
      where: {
        user_id: userId
      }
    })

    if (!hashedUserVerificationToken) {
      return this.failedOrSuccessRequest('failed', 'Failed to get hashedUserVerificationToken')
    }

    // TODO: Check if the token is valid or not
    const tokenMatches = await argon2.verify(hashedUserVerificationToken.hashed_token, token)

    if (!tokenMatches) {
      return this.failedOrSuccessRequest('failed', 'Invalid token')
    }

    // TODO: Check if the token is expired or not
    let isExpired = false
    if (hashedUserVerificationToken.expires.getTime() < new Date().getTime()) {
      isExpired = true
    }

    if (isExpired) {
      return this.failedOrSuccessRequest('failed', 'UserVerificationToken expired')
    }

    // TODO: Update isVerified column of user table in db
    // TODO: Delete the userVerificationToken in db
    try {
      await User.update({
        is_verified: 1,
        has_session: 1,
      }, {
        where: {
          id: userId
        }
      })
      await UserVerificationToken.destroy({
        where: {
          id: hashedUserVerificationToken.id
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    // TODO: Create the access and refresh token then returned it
    const accessToken = signJWT({ email: user.email, role: user.role }, '30s')
    const refreshToken = signJWT({ email: user.email }, '1w')


    // TODO: Save the refreshToken to the db
    try {
      const hashedRefreshToken = await this.hashData(refreshToken)
      await User.update({
        refresh_token: hashedRefreshToken
      }, {
        where: {
          id: user.id as number
        },
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    return this.failedOrSuccessRequest('sucess', { accessToken, refreshToken })
  }

  async signIn(email: string, password: string) {
    // Validate the data
    const result = await signInSchema.safeParse({
      email,
      password
    })

    if (!result.success) {
      return this.failedOrSuccessRequest('failed', result.error.format())
    }

    // Get the current user with the following email address
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      return this.failedOrSuccessRequest('failed', 'Invalid Credentials')
    }

    // Check the password from user and password in db
    const passwordMatches = await argon2.verify(user.password, password)

    if (!passwordMatches) {
      return this.failedOrSuccessRequest('failed', 'Invalid Credentials')
    }

    // Check if the user still has session or not
    if (user.has_session) {
      return this.failedOrSuccessRequest('failed', 'Bad Request')
    }

    // Update user session in database
    try {
      await User.update({
        has_session: 1,
      }, {
        where: {
          id: user.id
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    // Create the access and refresh token then returned it
    const accessToken = signJWT({ email: user.email, role: user.role }, '30s')
    const refreshToken = signJWT({ email: user.email }, '1w')


    // Save the refreshToken to the db
    try {
      const hashedRefreshToken = await this.hashData(refreshToken)
      await User.update({
        refresh_token: hashedRefreshToken
      }, {
        where: {
          id: user.id as number
        },
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    return this.failedOrSuccessRequest('success', { accessToken, refreshToken })
  }

  async signOut(email: string) {
    // Invalidate session and deleting the refreshToken of current from db
    try {
      await User.update({
        // @ts-ignore
        refresh_token: null,
        has_session: 0,
      }, {
        where: {
          email
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    return this.failedOrSuccessRequest('success', {})
  }

  hashData(data: string) {
    return argon2.hash(data)
  }

  failedOrSuccessRequest(status: string, data?: any) {
    return {
      status,
      data
    }
  }
}