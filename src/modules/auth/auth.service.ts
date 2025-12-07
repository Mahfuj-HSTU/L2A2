import config from '../../config'
import { pool } from '../../config/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
  delete result.rows[0].created_at
  delete result.rows[0].updated_at
  return result
}

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email
  ])
  if (result.rows.length === 0) {
    return {
      success: false,
      message: 'User not found',
      error: 'User not found'
    }
  }
  const user = result.rows[0]
  const isPasswordMatched = await bcrypt.compare(password, user.password)
  if (!isPasswordMatched) {
    return {
      success: false,
      message: 'Invalid password',
      error: 'Invalid password'
    }
  }

  const token = jwt.sign(
    { name: user.name, id: user.id, email: user.email, role: user.role },
    config.jwt_secret as string,
    {
      expiresIn: '7d'
    }
  )
  delete user.password
  delete user.created_at
  delete user.updated_at
  return { token, user }
}

export const authService = {
  registerUser,
  loginUser
}
