const mongoose = require('mongoose')

const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: {
    type: Schema,
    required: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now()
  },
  bugs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bug'
    }
  ],
  features: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Feature'
    }
  ]
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
