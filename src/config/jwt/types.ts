import { Algorithm } from 'jsonwebtoken'

export interface JWTConfig {
    secret: string
    algorithm: Algorithm
}
