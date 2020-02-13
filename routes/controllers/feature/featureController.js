const Feature = require('../../../models/feature')
const Project = require('../../../models/project')
const User = require('../../../models/user')

exports.features_get = async (req, res, next) => {
  const projectId = req.params.projId

  try {
    const features = await Feature.find({
      project: {
        _id: projectId
      }
    })

    res.send(features)
  } catch (err) {
    next(err)
  }
}

exports.feature_id_get = async (req, res, next) => {
  const featureId = req.params.featureId

  try {
    const feature = await Feature.findById(featureId)

    res.send(feature)
  } catch (err) {
    next(err)
  }
}

exports.feature_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.params.userId
  const projectId = req.params.projId

  try {
    const user = await User.findById(userId)
    const project = await Project.findById(projectId)

    const createdFeature = new Feature({
      name: body.name,
      description: body.description,
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

exports.feature_update_post = async (req, res, next) => {
  const body = req.body
  const featureId = req.params.featureId

  try {
    const feature = await Feature.findById(featureId)

    const updatedFeature = new Feature({
      ...feature.toObject(),
      name: body.name,
      description: body.description
    })

    const savedFeature = await Feature.findByIdAndUpdate(
      featureId,
      updatedFeature,
      { new: true }
    )

    res.json(savedFeature)
  } catch (err) {
    next(err)
  }
}
