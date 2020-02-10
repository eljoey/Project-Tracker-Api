const mongoose = require('mongoose')

const Schema = mongoose.Schema

const featureSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now()
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    }
  ]
})

const Feature = mongoose.model('Feature', featureSchema)

module.exports = Feature
