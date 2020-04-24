const Comment = require('../../../models/comment')
const User = require('../../../models/user')
const Bug = require('../../../models/bug')
const Feature = require('../../../models/feature')
const Project = require('../../../models/project')

exports.comments_get = async (req, res, next) => {
  const projId = req.params.projId
  const type = req.params.type
  const typeId = req.params.typeId
  const userId = req.decodedToken.id

  try {
    const user = await User.findById(userId)
    const project = await Project.findById(projId)

    // Check if (type) is part of project
    if (project[type].indexOf(typeId) === -1) {
      return res.json({
        error: 'Could not find bug or feature in the given project',
      })
    }

    // Check if user is a member of the project
    if (project.members.indexOf(userId) === -1) {
      return res.json({ error: 'Must be a project member to see comments' })
    }

    // Determines whether 'bug' or 'feature'
    let typeFound
    if (type === 'bugs') {
      typeFound = await Bug.findById(typeId).populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: ['_id', 'username'],
        },
      })
    } else {
      typeFound = await Feature.findById(typeId).populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: ['_id', 'username'],
        },
      })
    }

    // Sort comments by newest first
    typeFound.comments = typeFound.comments.sort((a, b) => {
      const dateA = new Date(a.created)
      const dateB = new Date(b.created)

      return dateB - dateA
    })

    res.send(typeFound.comments)
  } catch (err) {
    next(err)
  }
}

exports.comment_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.decodedToken.id
  const type = req.params.type
  const typeId = req.params.typeId
  const projId = req.params.projId

  try {
    const user = await User.findById(userId)
    const project = await Project.findById(projId)

    // Check if (type) is part of project
    if (project[type].indexOf(typeId) === -1) {
      return res.json({
        error: 'Could not find bug or feature in the given project',
      })
    }

    // Check if user is a member of the project
    if (project.members.indexOf(userId) === -1) {
      return res.json({ error: 'Must be a project member to comment' })
    }

    // Determines whether adding a comment to 'bugs' or 'features'
    let typeFound
    if (type === 'bugs') {
      typeFound = await Bug.findById(typeId)
    } else {
      typeFound = await Feature.findById(typeId)
    }

    if (!typeFound) {
      return res.json({
        error: 'Could not find Bug or Feature.  Make sure the ID is correct',
      })
    }

    const comment = new Comment({
      user,
      content: body.content,
      created: Date.now(),
    })

    const savedComment = await comment.save()
    typeFound.comments = typeFound.comments.concat(savedComment)
    await typeFound.save()

    res.json(savedComment)
  } catch (err) {
    next(err)
  }
}

exports.comment_update_post = async (req, res, next) => {
  const body = req.body
  const commentId = req.params.commentId
  const userId = req.decodedToken.id

  try {
    const comment = await Comment.findById(commentId)

    if (comment.user.toString() !== userId) {
      return res.json({ error: 'Unable to edit other users comments' })
    }

    const updatedComment = new Comment({
      ...comment.toObject(),
      content: body.content,
    })

    const savedComment = await Comment.findByIdAndUpdate(
      commentId,
      updatedComment,
      { new: true }
    )

    res.json(savedComment)
  } catch (err) {
    next(err)
  }
}

exports.comment_delete_post = async (req, res, next) => {
  const commentId = req.params.commentId
  const type = req.params.type
  const typeId = req.params.typeId
  const projId = req.params.projId
  const userId = req.decodedToken.id

  // Determines whether if type is a 'bug' or 'feature'
  let determinedType
  if (type === 'bugs') {
    determinedType = Bug
  } else {
    determinedType = Feature
  }

  try {
    const project = await Project.findById(projId)
    const comment = await Comment.findById(commentId)

    // Determine if user is allowed to delete (admin or original user)
    const adminCheck = project.admin.toString() === userId
    const commenterCheck = comment.user.toString() === userId
    if (!(adminCheck || commenterCheck)) {
      return res.json({
        error: 'Must be Admin of project or original commentor to delete.',
      })
    }

    const foundType = await determinedType.findById(typeId).populate('comments')

    const filteredComments = foundType.comments.filter(
      (comment) => comment._id.toString() !== commentId
    )

    const updatedType = new determinedType({
      ...foundType.toObject(),
      comments: filteredComments,
    })
    // Delete Comment
    await Comment.findByIdAndRemove(commentId)
    // Update the 'type' (bug or feature) with deleted comment
    await determinedType.findByIdAndUpdate(typeId, updatedType, { new: true })

    res.json({ msg: 'Comment Deleted' })
  } catch (err) {
    next(err)
  }
}
