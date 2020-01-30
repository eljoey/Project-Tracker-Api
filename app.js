const express = require('express')
const logger = require('./utils/logger')

const app = express()

const mongoose = require('mongoose')
const mongoDB = config.MONGODB_URI

logger.info('Connecting to DB...')

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    logger.info('Connected to MongoDB...')
  })
  .catch(err => {
    logger.error('error connecting to MongoDB')
  })