const langMiddleware = require('~/middlewares/appLanguage')
const { INVALID_LANGUAGE } = require('~/consts/errors')

jest.mock('~/utils/errorsHelper', () => ({
  createError: jest.fn((status, message) => ({ status, message }))
}))

describe('langMiddleware', () => {
  it('sets requested language and calls next if language is supported', () => {
    const req = {
      acceptsLanguages: () => 'en'
    }
    const res = {}
    const next = jest.fn()

    langMiddleware(req, res, next)

    expect(req.lang).toBe('en')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('throws error with INVALID_LANGUAGE if language is not supported', () => {
    const req = {
      acceptsLanguages: () => false
    }
    const res = {}
    const next = jest.fn()

    expect(() => langMiddleware(req, res, next)).toThrow()

    try {
      langMiddleware(req, res, next)
    } catch (err) {
      expect(err.message).toBe(INVALID_LANGUAGE)
      expect(err.status).toBe(400)
      expect(next).not.toHaveBeenCalled()
    }
  })
})
