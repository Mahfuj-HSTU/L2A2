import { Request, Response } from 'express'
import { bookingServices } from './booking.service'
import { vehiclesService } from '../vehicles/vehicles.service'

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }
    if (rent_start_date > rent_end_date) {
      return res.status(400).json({
        success: false,
        message: 'Rent end date must be after rent start date'
      })
    }
    const vehicle = await vehiclesService.getVehiclesByIdFromDb(
      vehicle_id as string
    )
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    }

    const days =
      (new Date(rent_end_date).getTime() -
        new Date(rent_start_date).getTime()) /
      86400000

    const total_price = days * Number(vehicle.daily_rent_price)

    const result = await bookingServices.createBookingInDB({
      total_price,
      ...req.body
    })
    res.status(200).json({
      success: true,
      message: 'Booking created successfully',
      data: result
    })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    })
  }
}

export const bookingController = {
  createBooking
}
