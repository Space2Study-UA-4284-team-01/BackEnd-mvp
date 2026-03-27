require('~/initialization/envSetup')
const idValidation = require('~/middlewares/idValidation')
const { INVALID_ID } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

describe('idValidation middleware', () => {
  const mockResponse = {}
  const mockNext = jest.fn()
  const error = createError(400, INVALID_ID)

  it('should throw INVALID_ID error when id is not a valid ObjectId', () => {
    const middlewareFunc = () => idValidation({}, mockResponse, mockNext, 'invalid_id')

    expect(middlewareFunc).toThrow(error)
  })

  it('should throw INVALID_ID error when id is an empty string', () => {
    const middlewareFunc = () => idValidation({}, mockResponse, mockNext, '')

    expect(middlewareFunc).toThrow(error)
  })

  it('should call next() when id is a valid ObjectId', () => {
    const validId = '507f1f77bcf86cd799439011'

    idValidation({}, mockResponse, mockNext, validId)

    expect(mockNext).toHaveBeenCalled()
  })
})
