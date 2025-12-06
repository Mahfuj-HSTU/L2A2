import { pool } from '../../config/db'

const createBookingInDB = async (payload: Record<string, unknown>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price
  } = payload
  try {
    const vehicle = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id = $1`,
      [vehicle_id]
    )
    if (vehicle.rowCount === 0) {
      return { success: false, message: 'Vehicle not found' }
    }
    if (vehicle.rows[0].availability_status === 'booked') {
      return {
        success: false,
        message: 'Vehicle is already booked'
      }
    }
    const bookingResult = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    )
    await pool.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    )
    const vehicleResult = await pool.query(
      `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
      [vehicle_id]
    )
    return {
      ...bookingResult.rows[0],
      vehicle: vehicleResult.rows[0]
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

const getAllBookingFromDB = async () => {
  const result = await pool.query('SELECT * FROM bookings')
  return result.rows
}

export const bookingServices = {
  createBookingInDB,
  getAllBookingFromDB
}
