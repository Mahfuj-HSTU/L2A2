import express from 'express'
import { bookingController } from './booking.controller'
import { verifyAuth } from '../../middleware/auth'

const router = express.Router()

router.post(
  '/',
  verifyAuth('admin', 'customer'),
  bookingController.createBooking
)
router.get(
  '/',
  verifyAuth('admin', 'customer'),
  bookingController.getAllBookings
)

export const bookingRouter = router
