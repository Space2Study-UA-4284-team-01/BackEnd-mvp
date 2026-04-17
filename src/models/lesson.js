const { Schema, model } = require('mongoose')
const { FIELD_CANNOT_BE_EMPTY, FIELD_IS_NOT_OF_PROPER_LENGTH } = require('~/consts/errors')
const {
  lengths: { MIN_NAME_LENGTH, MAX_NAME_LENGTH }
} = require('~/consts/validation')
const { LESSON, ATTACHMENT, CATEGORY, USER } = require('~/consts/models')

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('title').message],
      trim: true,
      minlength: [
        MIN_NAME_LENGTH,
        FIELD_IS_NOT_OF_PROPER_LENGTH('title', { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH }).message
      ],
      maxlength: [
        MAX_NAME_LENGTH,
        FIELD_IS_NOT_OF_PROPER_LENGTH('title', { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH }).message
      ]
    },
    description: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('description').message],
      trim: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, FIELD_CANNOT_BE_EMPTY('author').message]
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: ATTACHMENT
      }
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: [true, FIELD_CANNOT_BE_EMPTY('category').message]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model(LESSON, lessonSchema)