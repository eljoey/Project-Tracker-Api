const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
