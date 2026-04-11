const categoryService = require('~/services/category')

const createCategory = async (req, res) => {
  const data = req.body

  const newCategory = await categoryService.createCategory(data)

  res.status(201).json(newCategory)
}

const getCategories = async (req, res) => {
  //pass all query parameters to service for filtering, sorting and pagination
  const categories = await categoryService.getCategories(req.query)

  res.status(200).json(categories)
}

const getCategoriesNames = async (req, res) => {
  const names = await categoryService.getCategoriesNames(req.query)
  
  res.status(200).json({ data: names })
}

module.exports = {
  createCategory,
  getCategories,
  getCategoriesNames
}
