const Category = require('~/models/category')
const { seedCategories, categoriesData } = require('~/seed/seedCategories')
const logger = require('~/logger/logger')

const checkCategoriesExistence = async () => {
  try {
    const categoriesCount = await Category.countDocuments()

    if (categoriesCount < categoriesData.length) {
      await seedCategories.createCategories()
    } else {
      logger.info('Categories already exist, skipping seed.')
    }
  } catch (err) {
      logger.error('Error checking categories existence:', err)
      // Optionally, you could choose to seed categories if there's an error checking existence
  }
}

module.exports = checkCategoriesExistence
