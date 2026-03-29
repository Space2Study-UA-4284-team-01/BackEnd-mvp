const Category = require('~/models/category')
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
  }
}

module.exports = categoryService