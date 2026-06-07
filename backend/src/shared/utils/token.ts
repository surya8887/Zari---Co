import jwt from "jsonwebtoken"
import env from "../../config/env.js"

export const generateToken = async (user: { id: string; email: string; role: string; }) => {
    
    const token = jwt.sign(user, env.ACCESS_TOKEN_SECRET!, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES as any   
    })
    return token
}
export const generateRefreshToken = async (user: { id: string}) => {
    const token = jwt.sign(user, env.REFRESH_TOKEN_SECRET!, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES as any
    })
    return token
}

export const verfiyAccessToken = async (token: string) => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET!)
}

export const verfiyRefreshToken = async (token: string) => {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET!)
}
