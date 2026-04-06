const mongoose = require('mongoose')
const refs = require('~/consts/models')

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model(refs.SUBJECT, subjectSchema)
