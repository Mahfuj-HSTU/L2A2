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

const updateUserInDB = async (id: string, payload: Record<string, unknown>) => {
  const allowedFields = ['name', 'email', 'phone', 'role']

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
    `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    values
  )
  delete result.rows[0].password,
    delete result.rows[0].created_at,
    delete result.rows[0].updated_at

  return result.rows[0]
}

export const userServices = {
  getAllUsersFromDB,
  updateUserInDB
}
