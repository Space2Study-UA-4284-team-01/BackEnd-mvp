const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const {
  lengths: { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH },
  enums: { ROLE_ENUM }
} = require('~/consts/validation')
const errors = require('~/consts/errors')
const tokenService = require('~/services/token')
const Token = require('~/models/token')
const { expectError } = require('~/test/helpers')
const bcrypt = require('bcrypt')


jest.mock('~/services/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}))


describe('Auth controller', () => {
  let app, server, signupResponse

  beforeAll(async () => {
    ; ({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    signupResponse = await app.post('/auth/signup').send(user)
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  const user = {
    role: 'student',
    firstName: 'test',
    lastName: 'test',
    email: 'test@gmail.com',
    password: 'testpass_135'
  }

  describe('Signup endpoint', () => {
    it('should throw validation errors for the firstName field', async () => {
      const responseForFormat = await app.post('/auth/signup').send({ ...user, firstName: '12345' })
      const responseForNull = await app.post('/auth/signup').send({ ...user, firstName: null })

      const formatError = errors.NAME_FIELD_IS_NOT_OF_PROPER_FORMAT('firstName')
      const nullError = errors.FIELD_IS_NOT_DEFINED('firstName')
      expectError(422, formatError, responseForFormat)
      expectError(422, nullError, responseForNull)
    })

    it('should throw validation errors for the email format', async () => {
      const responseForFormat = await app.post('/auth/signup').send({ ...user, email: 'test' })
      const responseForType = await app.post('/auth/signup').send({ ...user, email: 312938 })

      const formatError = errors.FIELD_IS_NOT_OF_PROPER_FORMAT('email')
      const typeError = errors.FIELD_IS_NOT_OF_PROPER_TYPE('email', 'string')
      expectError(422, formatError, responseForFormat)
      expectError(422, typeError, responseForType)
    })

    it('should throw validation error for the role value', async () => {
      const signupResponse = await app.post('/auth/signup').send({ ...user, role: 'test' })

      const error = errors.FIELD_IS_NOT_OF_PROPER_ENUM_VALUE('role', ROLE_ENUM)
      expectError(422, error, signupResponse)
    })

    it('should throw validation errors for the password`s length', async () => {
      const responseForMax = await app
        .post('/auth/signup')
        .send({ ...user, password: '1'.repeat(MAX_PASSWORD_LENGTH + 1) })

      const responseForMin = await app
        .post('/auth/signup')
        .send({ ...user, password: '1'.repeat(MIN_PASSWORD_LENGTH - 1) })

      const error = errors.FIELD_IS_NOT_OF_PROPER_LENGTH('password', {
        min: MIN_PASSWORD_LENGTH,
        max: MAX_PASSWORD_LENGTH
      })
      expectError(422, error, responseForMax)
      expectError(422, error, responseForMin)
    })

    it('should throw ALREADY_REGISTERED error', async () => {
      await app.post('/auth/signup').send(user)

      const response = await app.post('/auth/signup').send(user)

      expectError(409, errors.ALREADY_REGISTERED, response)
    })
  })

  describe('SendResetPasswordEmail endpoint', () => {
    it('should throw USER_NOT_FOUND error', async () => {
      const response = await app.post('/auth/forgot-password').send({ email: 'invalid@gmail.com' })

      expectError(404, errors.USER_NOT_FOUND, response)
    })
  })

  describe('UpdatePassword endpoint', () => {
    let resetToken
    beforeEach(() => {
      const { firstName, email, role } = user

      resetToken = tokenService.generateResetToken({ id: signupResponse.body.userId, firstName, email, role })

      Token.findOne = jest.fn().mockResolvedValue({ save: jest.fn().mockResolvedValue(resetToken) })
    })
    afterEach(() => jest.resetAllMocks())

    it('should throw BAD_RESET_TOKEN error', async () => {
      const response = await app.patch('/auth/reset-password/invalid-token').send({ password: 'valid_pass1' })

      expectError(400, errors.BAD_RESET_TOKEN, response)
    })
  })

//--
  describe('Google Login endpoint', () => {

    beforeEach(() => {
      const { OAuth2Client } = require('google-auth-library')
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue({
        getPayload: () => ({
          email: 'google-test@gmail.com',
          given_name: 'Google',
          family_name: 'User'
        })
      })
    })

    afterEach(() => {
      jest.restoreAllMocks() 
    })

    const googlePayload = {
      token: { credential: 'fake-google-token' },
      role: 'student'
    }

    it('should login or signup user via Google', async () => {
      const response = await app
        .post('/auth/google-auth') 
        .send(googlePayload)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('accessToken')
      
      // is refresh token cookie set
      const setCookieHeader = response.headers['set-cookie'] || []
      const refreshTokenCookie = Array.isArray(setCookieHeader)
        ? setCookieHeader.find((cookie) => cookie.includes('refreshToken=')) 
        : setCookieHeader.includes('refreshToken=') ? setCookieHeader : undefined 

      expect(refreshTokenCookie).toBeDefined()
      expect(refreshTokenCookie).toContain('refreshToken=')
    })

    it('should return error if token is missing', async () => {
      const response = await app.post('/auth/google-auth').send({ role: 'student' })
      expect(response.status).toBe(400) 
    })
  })

  //-- 
  describe('Login endpoint', () => {
    beforeEach(async () => {
      const User = require('~/models/user')
      await User.findOneAndUpdate(
        { email: user.email }, 
        { isEmailConfirmed: true }
      )
    })

    it('should login successfully with correct credentials', async () => {
      const loginResponse = await app.post('/auth/login').send({
        email: user.email,
        password: user.password
      })

      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body).toHaveProperty('accessToken')
    })

    it('should throw INCORRECT_CREDENTIALS for wrong password', async () => {
      const response = await app.post('/auth/login').send({
        email: user.email,
        password: 'wrong_password'
      })

      expectError(401, errors.INCORRECT_CREDENTIALS, response)
    })

    it('should migrate plain text password to hashed on successful login', async () => {
      const User = require('~/models/user')
      
      // create a user with plain text password directly in the DB, bypassing the model hooks
      const plainPassword = 'plaintextpass123'
      const testUser = {
        role: ['student'],
        firstName: 'Migration',
        lastName: 'Test',
        email: 'migration@test.com',
        password: plainPassword, // unhashed
        lastLoginAs: 'student',
        appLanguage: 'en',
        isEmailConfirmed: true,
        isFirstLogin: true
      }
      
      // insert the user directly, bypassing the model (to avoid the hook)
      await User.collection.insertOne(testUser)
      
      // try to login
      const loginResponse = await app.post('/auth/login').send({
        email: testUser.email,
        password: plainPassword
      })
      
      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body).toHaveProperty('accessToken')
      
      // verify that the password is now hashed in the DB
      const updatedUser = await User.findOne({ email: testUser.email }).select('+password')
      expect(updatedUser.password).toMatch(/^\$2/) // starts with $2 (bcrypt hash)
      
      // verify that the hash matches the password
      const isValidHash = await bcrypt.compare(plainPassword, updatedUser.password)
      expect(isValidHash).toBe(true)
    })
  })
  

})
