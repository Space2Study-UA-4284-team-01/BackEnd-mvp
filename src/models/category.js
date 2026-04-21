const { Schema, model } = require('mongoose')
const { FIELD_CANNOT_BE_EMPTY, FIELD_IS_NOT_OF_PROPER_LENGTH } = require('~/consts/errors')
const {
  lengths: { MIN_NAME_LENGTH, MAX_NAME_LENGTH }
} = require('~/consts/validation')
const { CATEGORY } = require('~/consts/models')

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name').message],
      unique: true,
      minlength: [
        MIN_NAME_LENGTH,
        FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH }).message
      ],
      maxlength: [
        MAX_NAME_LENGTH,
        FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH }).message
      ]
    },
    appearance: {
      icon: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('icon').message],
        default: 'mocked-path-to-icon'
      },
      color: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('color').message],
        default: '#66C42C'
      }
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
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model(CATEGORY, categorySchema)
