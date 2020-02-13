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
  const userId = req.params.userId

  try {
    const user = await User.findById(userId)
    const project = await Project.findById(projId)

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
