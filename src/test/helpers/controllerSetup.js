const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const testUserAuthentication = require('~/utils/testUserAuth')
const { adminUserData, studentUserData, tutorUserData } = require('~/test/helpers/userData')

const setupControllerTests = () => {
  let app, server
  let adminAccessToken, studentAccessToken, tutorAccessToken

  beforeAll(async () => {
    // Start the server and get the app instance
    ;({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    // Authenticate users and get their access tokens
    adminAccessToken = await testUserAuthentication(app, adminUserData)
    studentAccessToken = await testUserAuthentication(app, studentUserData)
    tutorAccessToken = await testUserAuthentication(app, tutorUserData)
  })

  afterEach(async () => {
    // Clean up the database after each test to ensure test isolation
    await serverCleanup()
  })

  afterAll(async () => {
    // Stop the server after all tests are done
    await stopServer(server)
  })

  return {
    getApp: () => app,
    getTokens: () => ({
      adminAccessToken,
      studentAccessToken,
      tutorAccessToken
    })
  }
}

module.exports = setupControllerTests
