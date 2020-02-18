const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('-----------------')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  // Can add more specific handling if needed
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

const getToken = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  }
  next()
}

const verifyToken = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    req.decodedToken = decodedToken
  } catch {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  getToken,
  verifyToken
}
