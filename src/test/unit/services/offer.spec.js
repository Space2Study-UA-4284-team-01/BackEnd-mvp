const offerService = require('~/services/offer')
const Offer = require('~/models/offer')
const filterAllowedFields = require('~/utils/filterAllowedFields')
const { allowedOfferFieldsForUpdate } = require('~/validation/services/offer')

jest.mock('~/models/offer')
jest.mock('~/utils/filterAllowedFields')
jest.mock('~/validation/services/offer', () => ({
  allowedOfferFieldsForUpdate: ['price', 'title', 'description']
}))

describe('Offer service', () => {
  it('should get all offers', async () => {
    const mockOffers = [{ offers: [{ title: 'Math tutoring' }], total: 1 }]

    Offer.aggregate.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockOffers) })

    const pipeline = [{ $match: {} }]
    const result = await offerService.getOffers(pipeline)

    expect(Offer.aggregate).toHaveBeenCalledWith(pipeline)
    expect(result).toEqual(mockOffers[0])
  })

  it('should get an offer by ID', async () => {
    const mockOffer = {
      author: {
        firstname: 'John'
      },
      authorRole: 'tutor'
    }

    Offer.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockOffer)
    })

    const result = await offerService.getOfferById('someId')

    expect(Offer.findById).toHaveBeenCalledWith('someId')
    expect(result).toEqual(mockOffer)
  })

  it('should throw Document not found', async () => {
    Offer.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null)
    })

    await expect(offerService.getOfferById('nonExistentId')).rejects.toThrow()
  })

  it('should create new offer', async () => {
    const mockOffer = { _id: 'newId', title: 'Physics tutoring', price: 100 }
    Offer.create.mockResolvedValue(mockOffer)

    const data = {
      price: 100,
      proficiencyLevel: 'Intermediate',
      title: 'Physics tutoring',
      description: 'Great lessons',
      languages: ['English'],
      subject: 'subjectId',
      category: 'categoryId',
      status: 'active',
      FAQ: []
    }

    const result = await offerService.createOffer('authorId', 'tutor', data)

    expect(Offer.create).toHaveBeenCalledWith({
      author: 'authorId',
      authorRole: 'tutor',
      ...data
    })
    expect(result).toEqual(mockOffer)
  })

  it('should delete offer by ID', async () => {
    Offer.findByIdAndRemove.mockReturnValue({ exec: jest.fn().mockResolvedValue() })

    await offerService.deleteOffer('someId')

    expect(Offer.findByIdAndRemove).toHaveBeenCalledWith('someId')
  })
})
