import { Request, Response } from 'express'
import { userServices } from './user.service'

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsersFromDB()
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
}

export const userController = {
  getAllUsers
}
