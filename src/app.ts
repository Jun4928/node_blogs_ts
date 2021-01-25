import express, { Express } from 'express'
import { generalErrorHandler } from './errors'
import morgan from 'morgan'
import routes from './routes'

const logger = morgan('dev')

const app: Express = express()

app.use(express.json())
app.use(logger)
app.use(routes)

app.use(generalErrorHandler)

export default app