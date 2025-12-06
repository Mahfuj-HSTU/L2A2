import express from 'express'
import { vehiclesController } from './vehicles.controller'

const router = express.Router()

router.post('/', vehiclesController.createVehicle)
router.get('/', vehiclesController.getAllVehicles)

export const vehiclesRouter = router
