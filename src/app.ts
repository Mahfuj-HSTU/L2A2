import express, { NextFunction, Request, Response } from 'express'
import { initDb } from './config/db'
const app = express()

//* initial db
initDb()

// * parsing json body middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true })) //? for form data

app.get('/', (req: Request, res: Response) => {
  res.send('Hello! Welcome to Vehicle Rental System')
})

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found', path: req.path })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, message: 'Internal Server Error' })
})

export default app
