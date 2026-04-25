const mongoose = require('mongoose')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const validateObjectId = (value, fieldName = 'id', required = true) => {
  const isEmpty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '')

  if (isEmpty) {
    if (required) {
      throw createError(422, errors.FIELD_IS_NOT_DEFINED(fieldName))
    }
    return
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw createError(422, errors.FIELD_IS_NOT_OF_PROPER_TYPE(fieldName, 'ObjectId'))
  }
}

module.exports = {
  validateObjectId
}
