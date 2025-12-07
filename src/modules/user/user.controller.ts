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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const authUser = req.user as { id: number; role: 'admin' | 'customer' }
    console.log({ authUser })

    if (
      authUser.role === 'customer' &&
      String(authUser.id) !== String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update other users'
      })
    }
    let payload = { ...req.body }
    if (authUser.role === 'customer') {
      delete payload.role
    }
    const result = await userServices.updateUserInDB(userId as string, payload)

    if ('success' in result && result.success === false) {
      return res.status(400).json(result)
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const result = await userServices.deleteUserFromDb(
      userId as unknown as number
    )
    if ('success' in result) {
      return res.status(404).send(result)
    }
    res.send({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    })
  }
}

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser
}
