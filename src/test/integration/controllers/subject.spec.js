const mongoose = require('mongoose')

jest.mock('~/models/category')

const { expectError } = require('~/test/helpers')
const {
  UNAUTHORIZED,
  FORBIDDEN,
  FIELD_IS_NOT_DEFINED,
  FIELD_IS_NOT_OF_PROPER_LENGTH,
  FIELD_IS_NOT_OF_PROPER_TYPE,
  BODY_IS_NOT_DEFINED,
  CATEGORY_NOT_FOUND,
  SUBJECT_ALREADY_EXISTS
} = require('~/consts/errors')
const setupControllerTests = require('~/test/helpers/controllerSetup')
const Category = require('~/models/category')

const endpointUrl = '/subjects/'

describe('Subject controller', () => {
  // Get the app instance and tokens from the setup function
  const { getApp, getTokens } = setupControllerTests()
  let app, token

  const validCategoryId = new mongoose.Types.ObjectId().toString()

  const testSubjectData = {
    name: 'Mathematics',
    category: validCategoryId
  }

  beforeEach(() => {
    app = getApp()
    token = getTokens()

    // Mock the Category.findById method to return a valid category for testing
    Category.findById.mockResolvedValue({
      _id: validCategoryId,
      name: 'Test Category'
    })
  })

  describe('POST /subjects/', () => {
    it('should create a new subject successfully for admin user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.data).toMatchObject({
        name: testSubjectData.name,
        category: testSubjectData.category
      })
    })

    it('should return 409 when trying to create subject with existing name', async () => {
      const firstResponse = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(firstResponse.statusCode).toBe(201)

      const secondResponse = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(409, SUBJECT_ALREADY_EXISTS, secondResponse)
    })

    it('should return 403 for student user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 403 for tutor user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.post(endpointUrl).send(testSubjectData)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should return 422 for missing name', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ category: validCategoryId })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('name'), response)
    })

    it('should return 422 for too long name', async () => {
      const longName = 'A'.repeat(31)
      const response = await app
        .post(endpointUrl)
        .send({ name: longName, category: validCategoryId })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])
      expectError(422, FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: 1, max: 30 }), response)
    })

    it('should return 422 BODY_IS_NOT_DEFINED when body is empty', async () => {
      const response = await app
        .post(endpointUrl)
        .send({})
        .set('Content-Type', 'application/json')
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, BODY_IS_NOT_DEFINED, response)
    })

    it('should return 404 CATEGORY_NOT_FOUND when category does not exist', async () => {
      Category.findById.mockResolvedValue(null)

      const response = await app
        .post(endpointUrl)
        .send({ name: 'Physics', category: new mongoose.Types.ObjectId().toString() })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(404, CATEGORY_NOT_FOUND, response)
    })

    it('should return 422 when category is not a valid ObjectId', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'Physics', category: 'not-a-valid-id' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_TYPE('category', 'ObjectId'), response)
    })

    it('should return 422 FIELD_IS_NOT_DEFINED when category field is missing', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'Physics' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('category'), response)
    })

    it('should trim whitespace from name and create subject successfully', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: '  Mathematics  ', category: validCategoryId })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.data.name).toBe('Mathematics')
    })

    it('should return 422 when name is whitespace-only (empty after trim)', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: '   ', category: validCategoryId })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: 1, max: 30 }), response)
    })
  })
})