import { pool } from '../../config/db'
import bcrypt from 'bcryptjs'

const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, phone, password, role } = payload

  if (!name || !email || !phone || !password || !role) {
    return {
      success: false,
      message: 'All fields are required'
    }
  }

  if ((password as string)?.length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters long'
    }
  }

  const hashedPassword = await bcrypt.hash(password as string, 10)

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  )
  delete result.rows[0].password
  return result
}

export const authService = {
  registerUser
}
