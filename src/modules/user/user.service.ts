import { pool } from '../../config/db'

const getAllUsersFromDB = async () => {
  const result = await pool.query('SELECT * FROM users')
  if (result.rowCount === 0) {
    return { success: true, message: 'No users found' }
  }
  result.rows.forEach((user) => {
    delete user.password, delete user.created_at, delete user.updated_at
  })
  return result.rows
}

export const userServices = {
  getAllUsersFromDB
}
