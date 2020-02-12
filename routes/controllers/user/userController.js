const User = require('../../../models/user')
const bcrypt = require('bcrypt')

exports.user_id_get = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const userInfo = await User.findById(userId).populate('projects')

    if (!userInfo) {
      return res.status(400).send({ error: 'User not found' })
    }

    res.json(userInfo)
  } catch (err) {
    next(err)
  }
}

exports.user_create_post = async (req, res, next) => {
  const body = req.body

  try {
    // Validate pass length
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

exports.user_update_post = async (req, res, next) => {
  // TODO: Implement changing password.
  // TODO: Implement measure making sure only logged in user can change itself.
  //       Not that a logged in user can change any user if they know their ID.

  const body = req.body
  const userId = req.params.userId

  try {
    const user = await User.findById(userId)

    const updatedUser = new User({
      _id: user._id,
      username: user.username,
      firstName: body.firstName,
      lastName: body.lastName,
      passwordHash: user.passwordHash,
      created: user.created,
      projects: user.projects
    })

    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true
    })

    res.json(savedUser)
  } catch (err) {
    next(err)
  }
}
