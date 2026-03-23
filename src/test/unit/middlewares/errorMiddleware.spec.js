const errorHandler = require('~/middlewares/error')
const logger = require('~/logger/logger')
const getUniqueFields = require('~/utils/getUniqueFields')
const errors = require('~/consts/errors')

jest.mock('~/logger/logger')
jest.mock('~/utils/getUniqueFields')
jest.mock('~/consts/errors', () => ({
  INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR' },
  DOCUMENT_ALREADY_EXISTS: jest.fn(),
  MONGO_SERVER_ERROR: jest.fn(),
  VALIDATION_ERROR: jest.fn()
}))

describe('Global Error Middleware', () => {
  let res

  beforeEach(() => {
    jest.clearAllMocks()
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
  })

  const run = (err) => errorHandler(err, {}, res, jest.fn())

  it('should handle Mongo duplicate key error', () => {
    const err = { name: 'MongoServerError', code: 11000 }

    getUniqueFields.mockReturnValue(['email'])
    errors.DOCUMENT_ALREADY_EXISTS.mockReturnValue({
      code: 'DOCUMENT_ALREADY_EXISTS',
      message: 'exists'
    })

    run(err)

    expect(logger.error).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'DOCUMENT_ALREADY_EXISTS'
      })
    )
  })

  it('should handle generic Mongo errors', () => {
    const err = { name: 'MongoServerError', code: 999, message: 'db fail' }
    errors.MONGO_SERVER_ERROR.mockReturnValue({ code: 'MONGO_SERVER_ERROR' })

    run(err)

    expect(errors.MONGO_SERVER_ERROR).toHaveBeenCalledWith('db fail')
    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('should handle validation errors', () => {
    errors.VALIDATION_ERROR.mockReturnValue({ code: 'VALIDATION_ERROR' })

    run({ name: 'ValidationError', message: 'invalid' })

    expect(errors.VALIDATION_ERROR).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(409)
  })

  it('should use error status and code if provided', () => {
    run({ status: 401, code: 'UNAUTHORIZED', message: 'no-auth' })

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'no-auth'
    })
  })

  it('should fallback to 500 for unknown errors', () => {
    run(new Error('boom'))

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: errors.INTERNAL_SERVER_ERROR.code,
        message: 'boom'
      })
    )
  })
})
