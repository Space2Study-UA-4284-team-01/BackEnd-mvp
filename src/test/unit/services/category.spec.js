require('~/initialization/envSetup')
const Category = require('~/models/category')
const categoryService = require('~/services/category')
const { FIELD_ALREADY_EXISTS } = require('~/consts/errors')

jest.mock('~/models/category')

describe('Category service', () => {
  const categoryData = {
    name: 'UnitTestCategory',
    appearance: {
      icon: 'unittest-icon.png',
      color: '#123123'
    }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createCategory', () => {
    it('should create a new category when it does not exist', async () => {
      // should return null (not found) when checking for existing category
      Category.findOne.mockResolvedValue(null)

      const createdCategory = {
        _id: 'unique-id',
        ...categoryData,
        totalOffers: { student: 0, tutor: 0 }
      }

      // mock Category.create to return the created category
      Category.create.mockResolvedValue(createdCategory)

      const result = await categoryService.createCategory(categoryData)

      expect(Category.findOne).toHaveBeenCalledWith({ name: categoryData.name })
      expect(Category.create).toHaveBeenCalledWith({
        name: categoryData.name,
        appearance: categoryData.appearance
      })
      expect(result).toEqual(createdCategory)
    })

    it('should throw FIELD_ALREADY_EXISTS when category name is not unique', async () => {
      // should return an existing category when checking for existing category
      Category.findOne.mockResolvedValue({ name: categoryData.name })

      const expectedError = FIELD_ALREADY_EXISTS('name')

      await expect(categoryService.createCategory(categoryData)).rejects.toMatchObject({
        code: expectedError.code,
        message: expectedError.message
      })

      // category creation should not be attempted if a category with the same name already exists
      expect(Category.create).not.toHaveBeenCalled()
    })
  })
})
