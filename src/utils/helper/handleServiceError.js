const { createError } = require('~/utils/errorsHelper')
const errors = require('~/consts/errors')

const handleServiceError = (err, defaultMessage) => {
  if (err?.status) throw err

  const message = errors.MONGO_SERVER_ERROR(defaultMessage)

  throw createError(500, message)
}

module.exports = handleServiceError
