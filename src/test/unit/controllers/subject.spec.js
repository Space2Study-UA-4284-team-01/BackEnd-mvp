jest.mock('~/services/subject')

const subjectController = require('~/controllers/subject')
const subjectService = require('~/services/subject')
const errors = require('~/consts/errors')

describe('Subject Controller', () => {
  let mockReq, mockRes

  beforeEach(() => {
    jest.clearAllMocks()
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  describe('createSubject', () => {
    it('should call subjectService.createSubject with request body and return 201', async () => {
      const subjectData = { name: 'Mathematics', category: '507f1f77bcf86cd799439011' }
      const createdSubject = { _id: '123', ...subjectData }
      mockReq = { body: subjectData }
      subjectService.createSubject.mockResolvedValue(createdSubject)

      await subjectController.createSubject(mockReq, mockRes)

      expect(subjectService.createSubject).toHaveBeenCalledWith(subjectData)
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({ data: createdSubject })
    })

    it('should throw 422 BODY_IS_NOT_DEFINED when req.body is an empty object', async () => {
      mockReq = { body: {} }

      await expect(subjectController.createSubject(mockReq, mockRes)).rejects.toMatchObject({
        status: 422,
        message: errors.BODY_IS_NOT_DEFINED.message
      })
      expect(subjectService.createSubject).not.toHaveBeenCalled()
    })

    it('should throw 422 BODY_IS_NOT_DEFINED when req.body is null', async () => {
      mockReq = { body: null }

      await expect(subjectController.createSubject(mockReq, mockRes)).rejects.toMatchObject({
        status: 422,
        message: errors.BODY_IS_NOT_DEFINED.message
      })
      expect(subjectService.createSubject).not.toHaveBeenCalled()
    })

    it('should throw 422 BODY_IS_NOT_DEFINED when req.body is undefined', async () => {
      mockReq = {}

      await expect(subjectController.createSubject(mockReq, mockRes)).rejects.toMatchObject({
        status: 422,
        message: errors.BODY_IS_NOT_DEFINED.message
      })
      expect(subjectService.createSubject).not.toHaveBeenCalled()
    })

    it('should propagate errors thrown by subjectService without wrapping', async () => {
      const subjectData = { name: 'Mathematics', category: '507f1f77bcf86cd799439011' }
      mockReq = { body: subjectData }
      const serviceError = new Error('Subject already exists')
      serviceError.status = 409
      serviceError.code = 'SUBJECT_ALREADY_EXISTS'
      subjectService.createSubject.mockRejectedValue(serviceError)

      await expect(subjectController.createSubject(mockReq, mockRes)).rejects.toMatchObject({
        status: 409,
        code: 'SUBJECT_ALREADY_EXISTS'
      })
    })

    it('should not call subjectService when request body check fails', async () => {
      mockReq = { body: {} }

      try {
        await subjectController.createSubject(mockReq, mockRes)
      } catch (_err) {
        // expected to throw
      }

      expect(subjectService.createSubject).not.toHaveBeenCalled()
    })
  })
})