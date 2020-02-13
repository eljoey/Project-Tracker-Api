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