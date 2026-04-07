const mongoose = require('mongoose')

jest.mock('~/models/subject')
jest.mock('~/models/category', () => ({
  findById: jest.fn()
}))
jest.mock('~/utils/validationHelper', () => ({
  validateFunc: {
    required: jest.fn(),
    type: jest.fn(),
    length: jest.fn()
  }
}))

const subjectService = require('~/services/subject')
const Subject = require('~/models/subject')
const Category = require('~/models/category')
const errors = require('~/consts/errors')
const { validateFunc } = require('~/utils/validationHelper')

describe('Subject Service', () => {
  const validSubjectData = {
    name: 'Mathematics',
    category: new mongoose.Types.ObjectId().toString(),
    totalOffers: { student: 0, tutor: 0 }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock Category.findById to always return a valid category
    Category.findById.mockResolvedValue({ _id: validSubjectData.category })

    // Mock validation functions to do nothing (assume validation passes)
    validateFunc.required.mockImplementation(() => {})
    validateFunc.type.mockImplementation(() => {})
    validateFunc.length.mockImplementation(() => {})
  })

  test('should create a subject when it does not exist', async () => {
    const subject = { ...validSubjectData, id: '1' }
    Subject.findOne.mockResolvedValue(null)
    Subject.create.mockResolvedValue(subject)

    const result = await subjectService.createSubject(validSubjectData)

    // Validate that the service called the expected functions with correct arguments
    expect(Category.findById).toHaveBeenCalledWith(validSubjectData.category)
    expect(Subject.findOne).toHaveBeenCalledWith({ name: validSubjectData.name })
    expect(Subject.create).toHaveBeenCalledWith(validSubjectData)
    expect(result).toEqual(subject)
  })

  test('should throw an error when subject already exists', async () => {
    Subject.findOne.mockResolvedValue({ name: 'Mathematics' })

    await expect(subjectService.createSubject(validSubjectData)).rejects.toMatchObject({
      status: 409,
      message: errors.SUBJECT_ALREADY_EXISTS.message
    })
  })

  test('should throw an error when there is a server error', async () => {
    const errorMessage = 'Database connection failed'

    Subject.findOne.mockResolvedValue(null)
    Subject.create.mockRejectedValue(new Error(errorMessage))

    await expect(subjectService.createSubject(validSubjectData)).rejects.toMatchObject({
      status: 500
    })
  })

  test('should throw validation error when name is missing', async () => {
    validateFunc.required.mockImplementation(() => {
      const error = new Error('Name is required')
      error.status = 422
      throw error
    })

    await expect(subjectService.createSubject({})).rejects.toMatchObject({
      status: 422
    })
  })

  test('should throw validation error when category is missing', async () => {
    validateFunc.required
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => {
        const error = new Error('Category is required')
        error.status = 422
        throw error
      })

    await expect(subjectService.createSubject({ name: 'Mathematics' })).rejects.toMatchObject({
      status: 422
    })
  })
})
