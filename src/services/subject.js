const mongoose = require('mongoose')
const Subject = require('~/models/subject')
const Category = require('~/models/category')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const { validateFunc } = require('~/utils/validationHelper')
const mongosanitize = require('mongo-sanitize')

const subjectService = {
  createSubject: async (data) => {
    try {
      const { name, category } = data

      validateFunc.required('name', true, name)
      validateFunc.type('name', 'string', name)

      const sanitizedName = mongosanitize(name)
      const normalizedName = String(sanitizedName).trim()
      validateFunc.length('name', { min: 1, max: 30 }, normalizedName)

      validateFunc.required('category', true, category)

      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw createError(422, errors.FIELD_IS_NOT_OF_PROPER_TYPE('category', 'ObjectId'))
      }

      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        throw createError(404, errors.CATEGORY_NOT_FOUND)
      }

      const existingSubject = await Subject.findOne({ name: normalizedName })
      if (existingSubject) {
        throw createError(409, errors.SUBJECT_ALREADY_EXISTS)
      }
      return await Subject.create({ ...data, name: normalizedName })
    } catch (err) {
      if (err.status) throw err
      const message = err.message || errors.MONGO_SERVER_ERROR('Failed to create subject')

      throw createError(500, message)
    }
  }
}

module.exports = subjectService
