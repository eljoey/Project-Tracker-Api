const Project = require('../../../models/project')
const Bug = require('../../../models/bug')
const Feature = require('../../../models/feature')
const User = require('../../../models/user')
const Comment = require('../../../models/comment')

exports.projects_get = async (req, res, next) => {
  const userId = req.decodedToken.id

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
  const userId = req.decodedToken.id

  try {
    const user = await User.findById(userId)

    // TODO: Implement something that identifies a username that was not found.
    // Or possibly have a list of all users on frontend(this is probably a bad idea)

    const members = await User.find(
      {
        username: body.memberUsernames
      },
      'username firstName lastName'
    )

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

    res.send(newProject)
  } catch (err) {
    next(err)
  }
}

exports.project_update_post = async (req, res, next) => {
  // TODO: Handle not finding user here or on frontend

  const body = req.body
  const projId = req.params.projId
  const userId = req.decodedToken.id

  try {
    const project = await Project.findById(projId).populate('members')

    // Check if Admin of Project (Only Admin can update)
    if (userId !== project.admin._id.toString()) {
      return res.json({ error: 'Only the admin can update the project' })
    }

    // Check if adding members
    let foundMembers = []
    if (body.memberUsernames) {
      foundMembers = await User.find({
        username: body.memberUsernames
      })
    }
    // Create new members array and removes duplicates (Only worked when turning into JSON)
    const newMembers = project.members.concat(foundMembers)
    const membersJSON = newMembers.map(JSON.stringify)
    const filteredMembers = new Set(membersJSON)
    const arrMembers = Array.from(filteredMembers).map(JSON.parse)

    const updatedProject = new Project({
      ...project.toObject(),
      name: body.name,
      description: body.description,
      members: arrMembers
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
  const userId = req.decodedToken.id
  const projectId = req.params.projId

  try {
    const project = await Project.findById(projectId)
      .populate('bugs')
      .populate('features')

    // Check if Admin of Project (Only Admin can delete)
    if (userId !== project.admin._id.toString()) {
      return res.json({ error: 'Only the admin can delete the project' })
    }

    const arrBugIds = project.bugs.map(bug => bug._id)
    const arrFeatureIds = project.features.map(feature => feature._id)
    // Grab all the comment Id's from each Bug and Feature then merge into a single array
    const arrBugCommentIds = project.bugs
      .map(bug => bug.comments.map(comment => comment._id))
      .flat()
    const arrFeatureCommentIds = project.features
      .map(feature => feature.comments.map(comment => comment._id))
      .flat()
    let commentIds = [...arrBugCommentIds, ...arrFeatureCommentIds]

    await Comment.deleteMany()
      .where('_id')
      .in(commentIds)
    await Bug.deleteMany()
      .where('_id')
      .in(arrBugIds)
    await Feature.deleteMany()
      .where('_id')
      .in(arrFeatureIds)
    await Project.findByIdAndRemove(projectId)

    const user = await User.findById(userId)

    const filteredProjects = user.projects.filter(
      proj => proj._id.toString() !== projectId
    )

    const updatedUser = new User({
      ...user.toObject(),
      projects: filteredProjects
    })

    await User.findByIdAndUpdate(userId, updatedUser, { new: true })

    res.send({ msg: 'Project Deleted' })
  } catch (err) {
    next(err)
  }
}
