const Category = require('~/models/category')
const categoriesAggregateOptions = require('~/utils/categories/categoriesAggregateOptions')
const { validateFunc } = require('~/utils/validationHelper')
const { createError } = require('~/utils/errorsHelper')
const { FIELD_ALREADY_EXISTS } = require('~/consts/errors')

const categoryService = {
  createCategory: async (data) => {
    const { name, appearance } = data

    validateFunc.required('name', true, name)
    validateFunc.length('name', { min: 1, max: 30 }, name)

    const existingCategory = await Category.findOne({ name })

    if (existingCategory) {
      throw createError(409, FIELD_ALREADY_EXISTS('name'))
    }

    return await Category.create({
      name,
      appearance
    })
  },

  getCategories: async (query = {}) => {
    if (query.limit !== undefined) {
      validateFunc.number('limit', query.limit)
      if (query.limit < 0 || !Number.isInteger(Number(query.limit))) {
        throw createError(400, 'LIMIT_MUST_BE_NON_NEGATIVE_INTEGER')
      }
    }

    if (query.skip !== undefined) {
      validateFunc.number('skip', query.skip)
      if (query.skip < 0 || !Number.isInteger(Number(query.skip))) {
        throw createError(400, 'SKIP_MUST_BE_NON_NEGATIVE_INTEGER')
      }
    }

    const pipeline = categoriesAggregateOptions(query)
    const [result] = await Category.aggregate(pipeline)

    return result
  },

  getCategoriesNames: async () => {
    const categories = await Category
      .find({})
      .select('name')
      .lean()
    
    return categories.map(({ name }) => name)
  },

  getCategoryById: async (id) => {
    const category = await Category.findById(id).lean()

    if (!category) {
      throw createError(404, 'CATEGORY_NOT_FOUND')
    }

    return category
  }
}

module.exports = categoryService
