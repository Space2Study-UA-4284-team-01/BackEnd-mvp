const mongoose = require('mongoose')

const { expectError } = require('~/test/helpers')
const {
  UNAUTHORIZED,
  FORBIDDEN,
  FIELD_IS_NOT_DEFINED,
  FIELD_IS_NOT_OF_PROPER_LENGTH,
  SUBJECT_ALREADY_EXISTS,
  FIELD_IS_NOT_OF_PROPER_TYPE,
  SUBJECT_NOT_FOUND,
  BODY_IS_NOT_DEFINED
} = require('~/consts/errors')
const setupControllerTests = require('~/test/helpers/controllerSetup')
const Category = require('~/models/category')

const endpointUrl = '/subjects/'

describe('Subject controller', () => {
  // Get the app instance and tokens from the setup function
  const { getApp, getTokens } = setupControllerTests()
  let app, token

  let validCategoryId
  let testSubjectData
  let subjectId

  beforeEach(async () => {
    app = getApp()
    token = getTokens()

    // Create a category to use for subject creation
    const category = await Category.create({
      name: 'Test Category'
    })

    validCategoryId = category._id.toString()

    testSubjectData = {
      name: 'Mathematics',
      category: validCategoryId
    }
  })

  describe('GET /subjects/:id', () => {
    beforeEach(async () => {
      // Create a subject to test retrieval
      const created = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      subjectId = created.body.data._id
    })

    it.each([
      ['admin', 'adminAccessToken'],
      ['student', 'studentAccessToken'],
      ['tutor', 'tutorAccessToken']
    ])('should return subject data for valid id for %s user', async (_role, tokenKey) => {
      const response = await app.get(`${endpointUrl}${subjectId}`).set('Cookie', [`accessToken=${token[tokenKey]}`])

      expect(response.statusCode).toBe(200)
      expect(response.body.data).toMatchObject({
        _id: subjectId,
        name: testSubjectData.name,
        category: {
          _id: validCategoryId,
          name: 'Test Category'
        }
      })
    })

    it('should return 404 for non-existing subject', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString()
      const response = await app
        .get(`${endpointUrl}${nonExistingId}`)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(404, SUBJECT_NOT_FOUND, response)
    })

    it('should return 422 for invalid id format', async () => {
      const invalidId = '12345'
      const response = await app
        .get(`${endpointUrl}${invalidId}`)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_TYPE('id', 'ObjectId'), response)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.get(`${endpointUrl}${new mongoose.Types.ObjectId().toString()}`)

      expectError(401, UNAUTHORIZED, response)
    })
  })

  describe('GET /subjects', () => {
    it('should return subjects for authorized user', async () => {
      const response = await app.get(endpointUrl).set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should filter by category', async () => {
      const response = await app
        .get(`${endpointUrl}?category=${validCategoryId}`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)

      response.body.data.forEach((subject) => {
        expect(subject.category).toBeDefined()

        if (typeof subject.category === 'object') {
          expect(subject.category._id.toString()).toBe(validCategoryId)
        } else {
          expect(subject.category).toBe(validCategoryId)
        }
      })
    })

    it('should filter by name', async () => {
      const subjectName = 'Math'
      const response = await app
        .get(`${endpointUrl}?name=${subjectName}`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)

      response.body.data.forEach((subject) => {
        expect(subject.name.toLowerCase()).toContain(subjectName.toLowerCase())
      })
    })

    it('should return 422 for invalid category', async () => {
      const response = await app
        .get(`${endpointUrl}?category=invalid`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(422)
    })

    it('should return 401 if not authenticated', async () => {
      const response = await app.get(endpointUrl)

      expect(response.statusCode).toBe(401)
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
  })

  describe('PATCH /subjects/:id', () => {
    let subjectToUpdateId

    beforeEach(async () => {
      // Create a subject to update
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])
      subjectToUpdateId = response.body.data._id
    })

    it('should update subject successfully for admin user', async () => {
      const updatedData = { name: 'Updated Name' }
      const response = await app
        .patch(`${endpointUrl}${subjectToUpdateId}`)
        .send(updatedData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])
      expect(response.statusCode).toBe(200)
      expect(response.body.data).toMatchObject({
        _id: subjectToUpdateId,
        name: updatedData.name,
        category: testSubjectData.category
      })
    })

    it('should return 404 when trying to update non-existing subject', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString()
      const response = await app
        .patch(`${endpointUrl}${nonExistingId}`)
        .send({ name: 'New Name' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])
      expectError(404, SUBJECT_NOT_FOUND, response)
    })

    it('should return 409 when updating to existing name', async () => {
      await app
        .post(endpointUrl)
        .send({ name: 'Physics', category: validCategoryId })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      const response = await app
        .patch(`${endpointUrl}${subjectToUpdateId}`)
        .send({ name: 'Physics' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(409, SUBJECT_ALREADY_EXISTS, response)
    })

    it('should return 403 for student user', async () => {
      const response = await app
        .patch(`${endpointUrl}${subjectToUpdateId}`)
        .send({ name: 'New Name' })
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])
      expectError(403, FORBIDDEN, response)
    })

    it('should return 403 for tutor user', async () => {
      const response = await app
        .patch(`${endpointUrl}${subjectToUpdateId}`)
        .send({ name: 'New Name' })
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])
      expectError(403, FORBIDDEN, response)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.patch(`${endpointUrl}${subjectToUpdateId}`).send({ name: 'New Name' })
      expectError(401, UNAUTHORIZED, response)
    })

    it('should return 422 for missing body', async () => {
      const response = await app
        .patch(`${endpointUrl}${subjectToUpdateId}`)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])
      expectError(422, BODY_IS_NOT_DEFINED, response)
    })
  })
})
