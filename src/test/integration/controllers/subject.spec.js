const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const { expectError } = require('~/test/helpers')
const {
  UNAUTHORIZED,
  FORBIDDEN,
  FIELD_IS_NOT_DEFINED,
  FIELD_IS_NOT_OF_PROPER_LENGTH,
  SUBJECT_ALREADY_EXISTS
} = require('~/consts/errors')

const testUserAuthentication = require('~/utils/testUserAuth')

const {
  roles: { ADMIN, STUDENT, TUTOR }
} = require('~/consts/auth')

const endpointUrl = '/subjects/'

const testSubjectData = {
  name: 'Mathematics',
  description: 'Basic math subject'
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

describe('Subject controller', () => {
  let app, server, adminAccessToken, studentAccessToken, tutorAccessToken

  beforeAll(async () => {
    ;({ app, server } = await serverInit())
  })

  beforeEach(async () => {
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

  describe('POST /subjects/', () => {
    it('should create a new subject successfully for admin user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.data).toMatchObject({
        name: testSubjectData.name,
        description: testSubjectData.description
      })
    })

    it('should return 409 when trying to create subject with existing name', async () => {
      const firstResponse = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expect(firstResponse.statusCode).toBe(201)

      const secondResponse = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expectError(409, SUBJECT_ALREADY_EXISTS, secondResponse)
    })

    it('should return 403 for student user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 403 for tutor user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${tutorAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.post(endpointUrl).send(testSubjectData)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should return 422 for missing name', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ description: 'No name' })
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('name'), response)
    })

    it('should return 422 for too short name', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'A' })
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: 2, max: 50 }), response)
    })

    it('should allow missing description', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'Physics' })
        .set('Cookie', [`accessToken=${adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.data.name).toBe('Physics')
    })
  })
})
