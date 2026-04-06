const Subject = require('~/models/subject')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const { validateFunc } = require('~/utils/validationHelper')
const mongosanitize = require('mongo-sanitize')

const subjectService = {
  createSubject: async (data) => {
    try {
      const { name, description } = data

      validateFunc.required('name', true, name)
      validateFunc.type('name', 'string', name)
      const sanitizedName = mongosanitize(name)
      const normalizedName = String(sanitizedName).trim().toLowerCase()
      validateFunc.length('name', { min: 2, max: 50 }, normalizedName)

      if (description !== undefined) {
        validateFunc.type('description', 'string', description)
      }

      const existingSubject = await Subject.findOne({ name: normalizedName })
      if (existingSubject) {
        throw createError(409, errors.SUBJECT_ALREADY_EXISTS)
      }
      return await Subject.create({ ...data, name: normalizedName })
    } catch (err) {
      if (err.status) throw err

      if (err.code === 11000) {
        throw createError(409, errors.SUBJECT_ALREADY_EXISTS)
      }

      throw createError(500, errors.MONGO_SERVER_ERROR('Failed to create subject'))
    }
  }
}

module.exports = subjectService
