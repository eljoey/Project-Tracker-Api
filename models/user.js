const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3
  },
  passwordHash: String,
  created: {
    type: Date,
    required: true,
    default: Date.now()
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})
