const mongoose = require('mongoose')
const refs = require('~/consts/models')
const { MIN_NAME_LENGTH, MAX_NAME_LENGTH } = require('~/consts/validation')

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: MAX_NAME_LENGTH,
      minlength: MIN_NAME_LENGTH,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.CATEGORY,
      required: true
    },

    totalOffers: {
      student: {
        type: Number,
        default: 0
      },
      tutor: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model(refs.SUBJECT, subjectSchema)
