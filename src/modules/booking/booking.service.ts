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
    const user = await pool.query(
      `SELECT 1 FROM users WHERE id = $1 AND role = 'customer' LIMIT 1`,
      [customer_id]
    )
    if (user.rowCount === 0) {
      return { success: false, message: 'User not found' }
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
  const result = await pool.query(`
    SELECT b.id,b.customer_id,b.vehicle_id,b.rent_start_date,b.rent_end_date,b.total_price,b.status, u.name AS name, u.email AS email, v.vehicle_name,v.registration_number,v.type 
    FROM bookings b 
    JOIN vehicles v ON v.id = b.vehicle_id 
    JOIN users u ON u.id = b.customer_id 
    ORDER BY b.id DESC
  `)

  return result.rows
}

const updateBookingStatusIntoDB = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const bookingResult = await client.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [id]
    )

    if (bookingResult.rowCount === 0) {
      return { success: false, message: 'Booking not found' }
    }

    const booking = bookingResult.rows[0]

    if (payload.status === 'cancelled') {
      const rentStartDate = new Date(booking.rent_start_date)
      const currentDate = new Date()

      if (rentStartDate <= currentDate) {
        return {
          success: false,
          message: 'Booking cannot be cancelled after rent start'
        }
      }

      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      )
    } else if (payload.status === 'returned') {
      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      )
    }

    let updateQuery = `UPDATE bookings SET status = $1`
    const queryParams: any[] = [payload.status]

    if (payload.status === 'returned' && payload.end_date) {
      updateQuery += `, rent_end_date = $2`
      queryParams.push(payload.end_date)
    }

    updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING *`
    queryParams.push(id)

    const result = await client.query(updateQuery, queryParams)

    await client.query('COMMIT')
    return result.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error updating booking:', error)
    throw error
  } finally {
    client.release()
  }
}

export const bookingServices = {
  createBookingInDB,
  getAllBookingFromDB,
  updateBookingStatusIntoDB
}
