const Comment = require('../../../models/comment')
const User = require('../../../models/user')
const Bug = require('../../../models/bug')
const Feature = require('../../../models/feature')

exports.comment_create_post = async (req, res, next) => {
  const body = req.body
  const userId = req.params.userId
  const type = req.params.type
  const typeId = req.params.typeId

  try {
    const user = await User.findById(userId)

    // Determines whether adding a comment to 'bugs' or 'features'
    let typeFound
    if (type === 'bugs') {
      typeFound = await Bug.findById(typeId)
    } else {
      typeFound = await Feature.findById(typeId)
    }

    const comment = new Comment({
      user,
      content: body.content,
      created: Date.now()
    })

    const savedComment = await comment.save()
    typeFound.comments = typeFound.comments.concat(savedComment)
    await typeFound.save()

    // TODO: TRIM WHAT INFO IS SENT. (PASSWORDHASH IS A NONO)
    res.json(savedComment)
  } catch (err) {
    next(err)
  }
}

exports.comment_update_post = async (req, res, next) => {
  // TODO: Restrict update access to only the original commenter

  const body = req.body
  const commentId = req.params.commentId

  try {
    const comment = await Comment.findById(commentId)

    const updatedComment = new Comment({
      ...comment.toObject(),
      content: body.content
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
  // TODO: Determine if user is allowed to delete

  const commentId = req.params.commentId
  const type = req.params.type
  const typeId = req.params.typeId

  // Determines whether if type is a 'bug' or 'feature'
  let determinedType
  if (type === 'bugs') {
    determinedType = Bug
  } else {
    determinedType = Feature
  }

  try {
    const foundType = await determinedType.findById(typeId).populate('comments')

    console.log(foundType.comments)
    const filteredComments = foundType.comments.filter(
      comment => comment._id.toString() !== commentId
    )

    const updatedType = new determinedType({
      ...foundType.toObject(),
      comments: filteredComments
    })
    console.log(updatedType)
    // Delete Comment
    await Comment.findByIdAndRemove(commentId)
    // Update the 'type' (bug or feature) with deleted comment
    await determinedType.findByIdAndUpdate(typeId, updatedType, { new: true })

    res.json({ msg: 'Comment Deleted' })
  } catch (err) {
    next(err)
  }
}
