import express from 'express'
import { vehiclesController } from './vehicles.controller'
import { verifyAuth } from '../../middleware/auth'

const router = express.Router()

router.post('/', verifyAuth('admin'), vehiclesController.createVehicle)
router.get('/', vehiclesController.getAllVehicles)
router.get('/:vehicleId', vehiclesController.getVehiclesById)
router.put('/:vehicleId', verifyAuth('admin'), vehiclesController.updateVehicle)
router.delete(
  '/:vehicleId',
  verifyAuth('admin'),
  vehiclesController.deleteVehicles
)

export const vehiclesRouter = router
