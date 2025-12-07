import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'

export const verifyAuth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'You are not authorized' })
      }
      const decoded = jwt.verify(token, config.jwt_secret as string)
      req.user = decoded as JwtPayload
      if (!roles.includes((req.user as JwtPayload).role)) {
        return res
          .status(401)
          .json({ success: false, message: 'Your are not authorized' })
      }
      next()
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }
}
