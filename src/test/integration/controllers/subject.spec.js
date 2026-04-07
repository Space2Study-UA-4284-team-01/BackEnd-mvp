const { expectError } = require('~/test/helpers')
const {
  UNAUTHORIZED,
  FORBIDDEN,
  FIELD_IS_NOT_DEFINED,
  FIELD_IS_NOT_OF_PROPER_LENGTH,
  SUBJECT_ALREADY_EXISTS
} = require('~/consts/errors')
const setupControllerTests = require('~/test/helpers/controllerSetup')

const endpointUrl = '/subjects/'

const testSubjectData = {
  name: 'Mathematics',
  description: 'Basic math subject'
}

describe('Subject controller', () => {
  // Get the app instance and tokens from the setup function
  const { getApp, getTokens } = setupControllerTests()
  let app, token

  beforeEach(() => {
    app = getApp()
    token = getTokens()
  })

  describe('POST /subjects/', () => {
    it('should create a new subject successfully for admin user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testSubjectData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.data).toMatchObject({
        name: testSubjectData.name.toLowerCase(),
        description: testSubjectData.description
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
        .send({ description: 'No name' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('name'), response)
    })

    it('should return 422 for too short name', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'A' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: 2, max: 50 }), response)
    })

    it('should allow missing description', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'Physics' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.data.name).toBe('Physics'.toLowerCase())
    })
  })
})
