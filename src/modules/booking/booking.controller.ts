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
    if ('success' in result && result.success === false) {
      return res.status(400).json(result)
    }
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

const getAllBookings = async (req: Request, res: Response) => {
  const authUser = req.user as { id: number; role: 'admin' | 'customer' }
  try {
    const result = await bookingServices.getAllBookingFromDB()
    if (authUser.role === 'customer') {
      const userBookings = result.filter(
        (booking) => booking.customer_id === authUser.id
      )
      const data = userBookings.map(
        ({
          customer_id,
          name,
          email,
          vehicle_name,
          registration_number,
          type,
          ...booking
        }) => ({
          ...booking,
          vehicle: {
            vehicle_name,
            registration_number,
            type
          }
        })
      )
      return res.status(200).json({
        success: true,
        message: 'Your bookings retrieved successfully',
        data: data
      })
    } else {
      const data = result.map(
        ({
          name,
          email,
          vehicle_name,
          registration_number,
          type,
          ...booking
        }) => ({
          ...booking,
          customer: {
            name,
            email
          },
          vehicle: {
            vehicle_name,
            registration_number
          }
        })
      )
      res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: data
      })
    }
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    })
  }
}

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const result = await bookingServices.updateBookingStatusIntoDB(
      bookingId as string,
      req.body
    )
    if ('success' in result && result.success === false) {
      return res.status(400).json(result)
    }

    const authUser = req.user as { id: number; role: 'admin' | 'customer' }
    let message = 'Booking status updated successfully'
    let responseData = result

    if (authUser.role === 'customer' && req.body.status === 'cancelled') {
      message = 'Booking cancelled successfully'
    } else if (authUser.role === 'admin' && req.body.status === 'returned') {
      message = 'Booking marked as returned. Vehicle is now available'
      responseData = {
        ...result,
        vehicle: {
          availability_status: 'available'
        }
      }
    }

    res.status(200).json({
      success: true,
      message,
      data: responseData
    })
  } catch (error: any) {
    console.error('Error updating booking status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    })
  }
}

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBookingStatus
}
