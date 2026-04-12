const Subject = require('~/models/subject')
const Category = require('~/models/category')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const { validateFunc } = require('~/utils/validationHelper')
const getRegex = require('~/utils/getRegex')
const mongosanitize = require('mongo-sanitize')
const { validateObjectId } = require('~/utils/helper/validateObjectId')
const handleServiceError = require('~/utils/helper/handleServiceError')

const subjectService = {
  getSubjects: async (query) => {
    try {
      const { category, name } = query
      const filter = {}

      // Validate and build filter for category
      if (category) {
        validateObjectId(category, 'category')

        filter.category = category
      }

      // Filter by name
      if (name) {
        const sanitizedName = mongosanitize(name)
        filter.name = getRegex(sanitizedName)
      }
      return await Subject.find(filter).populate('category', 'name')
    } catch (err) {
      throw handleServiceError(err, 'Failed to retrieve subjects')
    }
  },

  createSubject: async (data) => {
    try {
      const { name, category } = data

      validateFunc.required('name', true, name)
      validateFunc.type('name', 'string', name)

      // Sanitize and normalize the name before validation and saving
      const sanitizedName = mongosanitize(name)
      const normalizedName = String(sanitizedName).trim()
      validateFunc.length('name', { min: 1, max: 30 }, normalizedName)

      validateFunc.required('category', true, category)

      // Validate that category is a valid ObjectId
      validateObjectId(category, 'category')

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
      throw handleServiceError(err, 'Failed to create subject')
    }
  }
}

module.exports = subjectService
