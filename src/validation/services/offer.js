const Offer = require('~/models/offer')
const { createError } = require('~/utils/errorsHelper')
const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')

const offerService = {
  getOffers: async (pipeline) => {
    const [offers] = await Offer.aggregate(pipeline).exec()
    return offers
  },

  getOfferById: async (id) => {
    const offer = await Offer.findById(id).populate('author subject category').lean().exec()

    if (!offer) {
      throw createError(404, DOCUMENT_NOT_FOUND('offer'))
    }

    return offer
  },

  createOffer: async (data) => {
    if (data.faq) {
      data.FAQ = data.faq
      delete data.faq
    }

    const newOffer = await Offer.create(data)
    return newOffer
  },

  updateOffer: async (id, filteredUpdateData) => {
    const offer = await Offer.findById(id).exec()

    if (!offer) {
      throw createError(404, DOCUMENT_NOT_FOUND('offer'))
    }
    if (filteredUpdateData.faq) {
      filteredUpdateData.FAQ = filteredUpdateData.faq
      delete filteredUpdateData.faq
    }

    for (const field in filteredUpdateData) {
      offer[field] = filteredUpdateData[field]
    }

    await offer.save()

    return offer
  },

  deleteOffer: async (id) => {
    const offer = await Offer.findByIdAndDelete(id).exec()

    if (!offer) {
      throw createError(404, DOCUMENT_NOT_FOUND('offer'))
    }

    return offer
  }
}

module.exports = offerService
