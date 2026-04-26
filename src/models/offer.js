const { Schema, model } = require('mongoose')

const {
  enums: { MAIN_ROLE_ENUM, SPOKEN_LANG_ENUM, PROFICIENCY_LEVEL_ENUM, OFFER_STATUS_ENUM }
} = require('~/consts/validation')
const { USER, OFFER, CATEGORY, SUBJECT } = require('~/consts/models')
const { ENUM_CAN_BE_ONE_OF } = require('~/consts/errors')

const offerSchema = new Schema(
  {
    price: {
      type: Number,
      required: true
    },
    proficiencyLevel: {
      type: String,
      enum: {
        values: PROFICIENCY_LEVEL_ENUM,
        message: ENUM_CAN_BE_ONE_OF('proficiency level', PROFICIENCY_LEVEL_ENUM)
      },
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    languages: {
      type: [String],
      enum: {
        values: SPOKEN_LANG_ENUM,
        message: ENUM_CAN_BE_ONE_OF('language', SPOKEN_LANG_ENUM)
      },
      required: true
    },
    authorRole: {
      type: String,
      enum: {
        values: MAIN_ROLE_ENUM,
        message: ENUM_CAN_BE_ONE_OF('author role', MAIN_ROLE_ENUM)
      },
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: true
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: SUBJECT,
      required: true
    },
    status: {
      type: String,
      enum: {
        values: OFFER_STATUS_ENUM,
        message: ENUM_CAN_BE_ONE_OF('offer status', OFFER_STATUS_ENUM)
      },
      default: OFFER_STATUS_ENUM[0]
    },
    FAQ: {
      type: [
        {
          question: {
            type: String,
            required: true
          },
          answer: {
            type: String,
            required: true
          }
        }
      ]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

module.exports = model(OFFER, offerSchema)
