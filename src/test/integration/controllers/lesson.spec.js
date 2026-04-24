const { expectError } = require('~/test/helpers')
const { UNAUTHORIZED, FORBIDDEN, FIELD_IS_NOT_DEFINED } = require('~/consts/errors')
const setupControllerTests = require('~/test/helpers/controllerSetup')
const Category = require('~/models/category')
const mongoose = require('mongoose')

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
    
    describe('GET /lessons/', () => {
      it('should return all lessons for authenticated user', async () => {
      await app
        .post(endpointUrl)
        .send(createLessonData())
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])  
          
      const response = await app
        .get(endpointUrl)
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBe(true) 
      expect(response.body.length).toBeGreaterThan(0)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.get(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should filter lessons by category', async () => {
        await app
            .post(endpointUrl)
            .send(createLessonData())
            .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        const response = await app
            .get(`${endpointUrl}?category=${categoryId}`)
            .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        expect(response.statusCode).toBe(200)

        expect(response.body.length).toBeGreaterThan(0) 

        response.body.forEach((lesson) => {
            expect(lesson.category.id).toBe(categoryId)
        })
    })
    
    it('should return empty array if no lessons match category', async () => {
        const response = await app
            .get(`${endpointUrl}?category=${categoryId}`)
            .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([])
    })
  })

  describe('GET /lessons/:id', () => {
    it('should return lesson by valid id', async () => {
        const createResponse = await app
        .post(endpointUrl)
        .send(createLessonData())
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        const lessonId = createResponse.body._id || createResponse.body.id

        const response = await app
        .get(`${endpointUrl}${lessonId}`)
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(createLessonData().title)
    })

    it('should return 404 for non-existent id', async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const response = await app
        .get(`${endpointUrl}${fakeId}`)
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        expect(response.statusCode).toBe(404)
    })

    it('should return 422 for invalid id format', async () => {
        const invalidId = 'invalid-id'

        const response = await app
        .get(`${endpointUrl}${invalidId}`)
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

        expect(response.statusCode).toBe(422)
    })
   })
})
