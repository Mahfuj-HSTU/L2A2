import { Pool } from 'pg'
import config from './index'

export const pool = new Pool({
  connectionString: config.database_url
})

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE CHECK (email = LOWER(email)),
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Database initialized')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}
