const Bug = require('../../../models/bug')
const User = require('../../../models/user')
const Project = require('../../../models/project')

exports.bugs_get = async (req, res, next) => {
  const projectId = req.params.projId

  try {
    const projectBugs = await Bug.find({ project: projectId })

    res.send(projectBugs)
  } catch (err) {
    next(err)
  }
}

exports.bug_id_get = async (req, res, next) => {
  const bugId = req.params.bugId

  try {
    const bug = await Bug.findById(bugId)

    res.send(bug)
  } catch (err) {
    next(err)
  }
}

exports.bug_create_post = async (req, res, next) => {
  const body = req.body
  const projId = req.params.projId
  const userId = req.decodedToken.id

  try {
    const user = await User.findById(userId)
    const project = await Project.findById(projId)

    // Check if user is a member of the project
    if (project.members.indexOf(userId) === -1) {
      return res.json({ error: 'Must be a project member' })
    }

    const createdBug = new Bug({
      name: body.name,
      description: body.description,
      project,
      createdBy: user,
      created: Date.now()
    })

    const savedBug = await createdBug.save()
    project.bugs = project.bugs.concat(savedBug)
    await project.save()

    res.send(savedBug)
  } catch (err) {
    next(err)
  }
}

exports.bug_update_post = async (req, res, next) => {
  const body = req.body
  const bugId = req.params.bugId

  try {
    const bug = await Bug.findById(bugId)

    // Check if user is a member of the project
    if (project.members.indexOf(userId) === -1) {
      return res.json({ error: 'Must be a project member' })
    }

    const updatedBug = new Bug({
      ...bug.toObject(),
      name: body.name,
      description: bug.description
    })

    const savedBug = await Bug.findByIdAndUpdate(bugId, updatedBug, {
      new: true
    })

    res.json(savedBug)
  } catch (err) {
    next(err)
  }
}

exports.bug_delete_post = async (req, res, next) => {
  const projId = req.params.projId
  const bugId = req.params.bugId

  try {
    const project = await Project.findById(projId)

    // Check if Admin of Project (Only Admin can delete)
    if (userId !== project.admin._id.toString()) {
      return res.json({ error: 'Only the admin can delete the bug' })
    }

    const filteredBugs = project.bugs.filter(
      bug => bug._id.toString() !== bugId
    )

    const updatedProject = new Project({
      ...project.toObject(),
      bugs: filteredBugs
    })

    await Bug.findByIdAndRemove(bugId)
    await Project.findByIdAndUpdate(projId, updatedProject, { new: true })

    res.send({ msg: 'Bug deleted' })
  } catch (err) {
    next(err)
  }
}
