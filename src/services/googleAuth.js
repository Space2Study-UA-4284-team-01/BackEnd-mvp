const { OAuth2Client } = require('google-auth-library')
const authService = require('~/services/auth')
const { getUserByEmail, createUser, privateUpdateUser } = require('~/services/user')
const crypto = require('node:crypto')
const { gmailCredentials } = require('~/configs/config')

const client = new OAuth2Client(gmailCredentials.clientId)

const googleAuthService = {
  verifyToken: async (token) => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: gmailCredentials.clientId
    })
    return ticket.getPayload()
  },

  loginOrSignup: async (token, role, language) => {
    const payload = await googleAuthService.verifyToken(token)
    const { email, given_name, family_name } = payload

    let user = await getUserByEmail(email)

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex')
      user = await createUser(role, given_name, family_name, email, randomPassword, language)

      // Автоматично підтверджуємо пошту, бо це Google
      await privateUpdateUser(user._id, { isEmailConfirmed: true })
    }

    return await authService.login(email, null, true)
  }
}

module.exports = googleAuthService
