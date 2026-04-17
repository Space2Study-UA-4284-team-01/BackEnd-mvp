const offerSchema = require('~/validation/schemas/offer')

const allowedOfferFieldsForUpdate = {
  price: true,
  proficiencyLevel: true,
  title: true,
  description: true,
  languages: true,
  subject: true,
  category: true,
  status: true,
  faq: true
}

module.exports = {
  offerSchema,
  allowedOfferFieldsForUpdate
}
