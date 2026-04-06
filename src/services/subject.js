const Subject = require('~/models/subject')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const { validateFunc } = require('~/utils/validationHelper')

const subjectService = {
  createSubject: async (data) => {
    try {
      const { name, description } = data

      validateFunc.required('name', true, name)
      validateFunc.type('name', 'string', name)
      validateFunc.length('name', { min: 2, max: 50 }, name)

      if (description !== undefined) {
        validateFunc.type('description', 'string', description)
      }

      const existingSubject = await Subject.findOne({ name })
      if (existingSubject) {
        throw createError(409, errors.SUBJECT_ALREADY_EXISTS)
      }
      return await Subject.create(data)
    } catch (err) {
      if (err.status) throw err

      if (err.code === 11000) {
        throw createError(409, errors.SUBJECT_ALREADY_EXISTS)
      }

      throw createError(500, errors.MONGO_SERVER_ERROR(err.message))
    }
  }
}

module.exports = subjectService
