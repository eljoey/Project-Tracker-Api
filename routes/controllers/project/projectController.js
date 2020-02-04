const Project = require('../../../models/project')
const User = require('../../../models/user')

exports.project_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.params.id

  //TODO: Implement adding other members to a project

  try {
    const user = await User.findById(userId)

    // const members = await User.find({
    //   username: body.memberUsernames
    // })

    const newProject = new Project({
      name: body.name,
      admin: user,
      created: Date.now()
    })

    const savedProject = await newProject.save()
    user.projects = user.projects.concat(savedProject)
    await user.save()

    res.send(savedProject)
  } catch (err) {
    next(err)
  }
}
