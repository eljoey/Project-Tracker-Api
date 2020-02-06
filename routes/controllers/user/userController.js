const User = require('../../../models/user')
const bcrypt = require('bcrypt')

exports.user_id_get = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const userInfo = await (await User.findById(userId)).populate('projects')

    if (!userInfo) {
      return res.status(400).send({ error: 'User not found' })
    }

    res.json(userInfo.toJSON())
  } catch (err) {
    next(err)
  }
}

exports.user_create_post = async (req, res, next) => {
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
}
