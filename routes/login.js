const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.post('/', async (req, res, next) => {
  const body = req.body
  const user = await User.findOne({ username: body.username }, '+passwordHash')
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid Username or Password'
    })
  }

  const tokenForUser = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(tokenForUser, process.env.SECRET)

  res.status(200).send({ token })
})

module.exports = router
