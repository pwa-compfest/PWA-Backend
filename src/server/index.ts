import cors from 'cors'
import helmet from 'helmet'
import express, { json, urlencoded } from 'express'
import {db}  from '../config/database'
import routes from '@/routes'

const app = express()

app.use(json())
app.use(cors())
app.use(helmet())
app.use(urlencoded({ extended: true }))

db.authenticate()
  .then(() => console.log('[DB] Connection has been established successfully.'))
  .catch((error) => console.error('[DB] Unable to connect to the database:', error));
  
app.use(routes)

export default app