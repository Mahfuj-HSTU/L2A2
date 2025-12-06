import { pool } from '../../config/db'

const createVehicleIntoDb = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
  } = payload

  const result = await pool.query(
    'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    ]
  )

  return result
}

const getAllVehiclesFromDb = async () => {
  const result = await pool.query('SELECT * FROM vehicles')
  return result
}

const getVehiclesByIdFromDb = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id])
  return result
}

const updatedVehicleIntoDb = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const allowedFields = [
    'vehicle_name',
    'type',
    'registration_number',
    'daily_rent_price',
    'availability_status'
  ]

  const keys = Object.keys(payload).filter((key) => allowedFields.includes(key))

  if (keys.length === 0) {
    return {
      success: false,
      message: 'No valid fields provided for update'
    }
  }

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ')

  const values = [...keys.map((key) => payload[key]), id]

  const result = await pool.query(
    `UPDATE vehicles SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`,
    values
  )

  return result
}

const deleteVehicleFromDb = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id])
  if (result.rowCount === 0) {
    return {
      success: false,
      message: 'Vehicle not found'
    }
  }
  return result
}

export const vehiclesService = {
  createVehicleIntoDb,
  getAllVehiclesFromDb,
  getVehiclesByIdFromDb,
  updatedVehicleIntoDb,
  deleteVehicleFromDb
}
