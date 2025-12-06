import app from './app'
import config from './config'

const port = config.port

app.listen(port, () => {
  console.log(`Vehicle Rental System Server running on port ${port}`)
})
