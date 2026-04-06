const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const { expectError } = require('~/test/helpers')
const { 
  UNAUTHORIZED, 
  FORBIDDEN, 
  FIELD_IS_NOT_DEFINED, 
  FIELD_IS_NOT_OF_PROPER_LENGTH,
  FIELD_ALREADY_EXISTS 
} = require('~/consts/errors')
const testUserAuthentication = require('~/utils/testUserAuth')
const {
  roles: { ADMIN, STUDENT, TUTOR }
} = require('~/consts/auth')

const endpointUrl = '/categories/'

const testCategoryData = {
  name: 'Mathematics',
  appearance: {
    icon: 'math-icon.png',
    color: '#FF0000'
  }
}

const adminUserData = {
  role: ADMIN,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'adminpass',
  appLanguage: 'en',
  isEmailConfirmed: true,
  lastLogin: new Date().toJSON(),
  lastLoginAs: ADMIN
}

const studentUserData = {
  role: STUDENT,
  firstName: 'Student',
  lastName: 'User',
  email: 'student@example.com',
  password: 'studentpass',
  appLanguage: 'en',
  isEmailConfirmed: true,
  lastLogin: new Date().toJSON(),
  lastLoginAs: STUDENT
}

const tutorUserData = {
  role: TUTOR,
  firstName: 'Tutor',
  lastName: 'User',
  email: 'tutor@example.com',
  password: 'tutorpass',
  appLanguage: 'en',
  isEmailConfirmed: true,
  lastLogin: new Date().toJSON(),
  lastLoginAs: TUTOR
}

describe('Category controller', () => {
  let app, server, adminAccessToken, studentAccessToken, tutorAccessToken

  beforeAll(async () => {
    ; ({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    // receive access tokens for all user roles before each test
    adminAccessToken = await testUserAuthentication(app, adminUserData)
    studentAccessToken = await testUserAuthentication(app, studentUserData)
    tutorAccessToken = await testUserAuthentication(app, tutorUserData)
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  describe('POST /categories/', () => {
    it('should create a new category successfully for admin user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body).toMatchObject({
        name: testCategoryData.name,
        appearance: testCategoryData.appearance
      })
    })

    it('should return 409 when trying to create category with existing name', async () => {
      // 1. FIRST REQUEST: Create a category (should succeed with 201)
      const firstResponse = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expect(firstResponse.statusCode).toBe(201)

      // 2. SECOND REQUEST: Try to create the same category (should return 409)
      const secondResponse = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expectError(409, FIELD_ALREADY_EXISTS('name'), secondResponse)
    })

    it('should return 403 for student user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 403 for tutor user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${tutorAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should return 422 for invalid data - missing name', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ appearance: testCategoryData.appearance })
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('name'), response)
    })

    it('should return 422 for invalid data - name too long', async () => {
      const invalidData = {
        name: 'A'.repeat(31),
        appearance: testCategoryData.appearance
      }

      const response = await app
        .post(endpointUrl)
        .send(invalidData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: 1, max: 30 }), response)
    })

    it('should NOT return 422 for missing appearance because of defaults in schema', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'Brand New Category' })
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.name).toBe('Brand New Category')
      expect(response._body.appearance).toHaveProperty('icon')
      expect(response._body.appearance).toHaveProperty('color')
    })
  })
})