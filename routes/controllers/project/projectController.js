const Project = require('../../../models/project')
const User = require('../../../models/user')

exports.projects_get = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const projects = await Project.find({
      members: {
        _id: userId
      }
    })

    res.send(projects)
  } catch (err) {
    next(err)
  }
}

exports.project_id_get = async (req, res, next) => {
  const projectId = req.params.projId

  try {
    const project = await Project.findById(projectId)
      .populate('bugs')
      .populate('features')
      .populate('members', ['username', 'firstName', 'lastName'])
      .populate('admin', ['username', 'firstName', 'lastName'])

    res.send(project)
  } catch (err) {
    next(err)
  }
}

exports.project_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.params.userId

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

    const savedProject = await newProject.save()
    user.projects = user.projects.concat(savedProject)
    await user.save()

    res.send(savedProject)
  } catch (err) {
    next(err)
  }
}

exports.project_update_post = async (req, res, next) => {
  const body = req.body
  const projId = req.params.projId
  const userId = req.params.userId

  try {
    const project = await Project.findById(projId)

    // Check if Admin of Project (Only Admin can update)
    if (userId !== project.admin._id.toString()) {
      return res.json({ error: 'Only the admin can update the project' })
    }

    const updatedProject = new Project({
      ...project.toObject(),
      name: body.name,
      description: body.description
    })

    const savedProject = await Project.findByIdAndUpdate(
      projId,
      updatedProject,
      { new: true }
    )

    res.json(savedProject)
  } catch (err) {
    next(err)
  }
}

exports.project_delete_post = async (req, res, next) => {
  const userId = req.params.userId
  const projectId = req.params.projId

  // TODO
}
