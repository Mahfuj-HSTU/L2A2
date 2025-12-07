import express from 'express'
import { userController } from './user.controller'
import { verifyAuth } from '../../middleware/auth'

const router = express.Router()

router.get('/', verifyAuth('admin'), userController.getAllUsers)
router.put(
  '/:userId',
  verifyAuth('admin', 'customer'),
  userController.updateUser
)
router.delete('/:userId', verifyAuth('admin'), userController.deleteUser)

export const userRouter = router
