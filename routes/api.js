const express = require('express')
const router = express.Router()

const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/user/create', async (req, res, next) => {
  try {
    const body = req.body

    // validate pass length
    if (body.password.length < 7) {
      return res.status(400).json({ error: 'Password length is too short' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      created: Date.now(),
      passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = router
