const { expectError } = require('~/test/helpers')
const { UNAUTHORIZED, FORBIDDEN, FIELD_IS_NOT_DEFINED } = require('~/consts/errors')
const setupControllerTests = require('~/test/helpers/controllerSetup')
const Category = require('~/models/category')

const endpointUrl = '/lessons/'

describe('Lesson controller', () => {
  const { getApp, getTokens } = setupControllerTests()
  let app, token, categoryId
    
  const createLessonData = (overrides = {}) => ({
    title: 'Intro to Algebra',
    description: 'Basic algebra course content',
    category: categoryId,
    ...overrides
  })

  beforeEach(async () => {
    app = getApp()
    token = getTokens()

    const testCategory = await Category.create({
      name: 'TestLessonCategory',
      appearance: {
        icon: 'math-icon.png',
        color: '#FF0000'
      }
    })
    
    categoryId = testCategory._id.toString()
  })

  describe('POST /lessons/', () => {
    it('should create a new lesson successfully for tutor user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(createLessonData())
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response.body).toMatchObject(createLessonData())
    })

    it('should return 403 for student user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(createLessonData())
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })
    

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.post(endpointUrl).send(createLessonData())
      expectError(401, UNAUTHORIZED, response)
    })

    it('should return 422 for missing required field (title)', async () => {
      const response = await app
        .post(endpointUrl)
        .send(createLessonData({ title: undefined }))
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('title'), response)
    })
  })
})
