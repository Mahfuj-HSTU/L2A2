import express, { NextFunction, Request, Response } from 'express'
import { initDb } from './config/db'
import { vehiclesRouter } from './modules/vehicles/vehicles.route'
import { authRouter } from './modules/auth/auth.route'
import { bookingRouter } from './modules/booking/booking.route'
import { userRouter } from './modules/user/user.route'
const app = express()
initDb()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello! Welcome to Vehicle Rental System')
})

app.use('/api/v1/vehicles', vehiclesRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/bookings', bookingRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found', path: req.path })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, message: 'Internal Server Error' })
})

export default app
