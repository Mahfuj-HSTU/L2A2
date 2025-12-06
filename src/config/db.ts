import { Pool } from 'pg'
import config from './index'

export const pool = new Pool({
  connectionString: config.database_url
})

export const initDb = async () => {
  console.log('Database connected')
}
