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
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No vehicles found',
        data: result.rows
      })
    }
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

const getVehiclesById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params
  try {
    const result = await vehiclesService.getVehiclesByIdFromDb(
      vehicleId as string
    )
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No vehicle found',
        data: result.rows
      })
    }
    res.status(200).json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: result.rows[0]
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch vehicle' })
  }
}

const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params
  try {
    const result = await vehiclesService.updatedVehicleIntoDb(
      vehicleId as string,
      req.body
    )
    if ('success' in result) {
      return res.status(400).json(result)
    }
    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result.rows[0]
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to update vehicle' })
  }
}

const deleteVehicles = async (req: Request, res: Response) => {
  const { vehicleId } = req.params
  try {
    const result = await vehiclesService.deleteVehicleFromDb(
      vehicleId as string
    )
    if ('success' in result) {
      return res.status(404).json(result)
    }
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete vehicle' })
  }
}

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
  getVehiclesById,
  updateVehicle,
  deleteVehicles
}
