const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
