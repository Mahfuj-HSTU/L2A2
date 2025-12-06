import { Request, Response } from 'express'
import { vehiclesService } from './vehicles.service'

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.createVehicleIntoDb(req.body)
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result.rows[0]
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to create vehicle' })
  }
}

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getAllVehiclesFromDb()
    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result.rows
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch vehicles' })
  }
}

export const vehiclesController = {
  createVehicle,
  getAllVehicles
}
