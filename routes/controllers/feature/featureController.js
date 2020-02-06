const Feature = require('../../../models/feature')
const Project = require('../../../models/project')
const User = require('../../../models/user')

exports.feature_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.params.userId
  const projectId = req.params.projId

  try {
    const user = await User.findById(userId)
    const project = await Project.findById(projectId)

    const createdFeature = new Feature({
      name: body.name,
      details: body.details,
      project,
      createdBy: user,
      created: Date.now()
    })

    const savedFeature = await createdFeature.save()
    project.features = project.features.concat(savedFeature)
    await project.save()

    res.send(savedFeature)
  } catch (err) {
    next(err)
  }
}
