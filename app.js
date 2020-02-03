const express = require('express')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const cors = require('cors')
const bodyParser = require('body-parser')

const apiRouter = require('./routes/api')
const loginRouter = require('./routes/login')

const app = express()

const mongoose = require('mongoose')
const mongoDB = config.MONGODB_URI

logger.info('Connecting to DB...')

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    logger.info('Connected to MongoDB...')
  })
  .catch(err => {
    logger.error('error connecting to MongoDB')
  })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/login', loginRouter)
app.use('/api', apiRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = config.PORT || '3000'
app.listen(PORT, () => logger.info(`app listening on port ${PORT}`))
