import express, { NextFunction, Request, Response } from 'express'
import { initDb } from './config/db'
import { vehiclesRouter } from './modules/vehicles/vehicles.route'
const app = express()
initDb()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello! Welcome to Vehicle Rental System')
})

app.use('/api/v1/vehicles', vehiclesRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found', path: req.path })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, message: 'Internal Server Error' })
})

export default app
