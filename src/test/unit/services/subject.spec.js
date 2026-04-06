jest.mock('~/models/subject')

const subjectService = require('~/services/subject')
const Subject = require('~/models/subject')
const errors = require('~/consts/errors')

describe('Subject Service', () => {
  const validSubjectData = {
    name: 'Mathematics',
    description: 'The study of numbers, shapes, and patterns.'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("should create a subject when it doesn't exist", async () => {
    const subject = { ...validSubjectData, id: '1' }
    Subject.findOne.mockResolvedValue(null)
    Subject.create.mockResolvedValue(subject)

    const result = await subjectService.createSubject(validSubjectData)

    expect(Subject.create).toHaveBeenCalledWith(validSubjectData)
    expect(result).toEqual(subject)
  })

  test('should throw an error when subject already exists', async () => {
    Subject.create.mockRejectedValue({ code: 11000 })
    await expect(subjectService.createSubject(validSubjectData)).rejects.toMatchObject({
      status: 409,
      code: errors.SUBJECT_ALREADY_EXISTS.code
    })
  })

  test('should throw an error when there is a server error', async () => {
    const errorMessage = 'Database connection failed'

    Subject.findOne.mockResolvedValue(null)
    Subject.create.mockRejectedValue(new Error(errorMessage))

    await expect(subjectService.createSubject(validSubjectData)).rejects.toMatchObject({
      status: 500,
      code: errors.MONGO_SERVER_ERROR(errorMessage).code
    })
  })

  test('should throw validation error when name is missing', async () => {
    await expect(subjectService.createSubject({})).rejects.toMatchObject({
      status: 422
    })
  })
})
