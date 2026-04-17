const Joi = require('joi')
const { enums, lengths } = require('~/consts/validation')

const offerSchema = Joi.object({
  price: Joi.number().min(1).required(),
  proficiencyLevel: Joi.string()
    .valid(...enums.PROFICIENCY_LEVEL_ENUM)
    .required(),
  title: Joi.string().trim().min(lengths.MIN_NAME_LENGTH).max(100).required(),
  description: Joi.string().trim().min(1).max(1000).required(),
  languages: Joi.array()
    .items(Joi.string().valid(...enums.SPOKEN_LANG_ENUM))
    .min(1)
    .required(),
  authorRole: Joi.string()
    .valid(...enums.MAIN_ROLE_ENUM)
    .required(),
  author: Joi.string().required(),
  subject: Joi.string().required(),
  category: Joi.string().required(),
  status: Joi.string()
    .valid(...enums.OFFER_STATUS_ENUM)
    .default('active'),
  faq: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().required(),
        answer: Joi.string().trim().required()
      })
    )
    .required()
})

module.exports = offerSchema
