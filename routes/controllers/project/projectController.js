const Project = require('../../../models/project')
const User = require('../../../models/user')

exports.project_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.params.id

  try {
    const user = await User.findById(userId)

    // TODO: Implement something that identifies a username that was not found.
    // Or possibly have a list of all users on frontend(this is probably a bad idea)

    const members = await User.find({
      username: body.memberUsernames
    })

    const newProject = new Project({
      name: body.name,
      description: body.description,
      admin: user,
      members,
      created: Date.now()
    })
    console.log(newProject)

    const savedProject = await newProject.save()
    user.projects = user.projects.concat(savedProject)
    await user.save()

    res.send(savedProject)

    res.send(members)
  } catch (err) {
    next(err)
  }
}
