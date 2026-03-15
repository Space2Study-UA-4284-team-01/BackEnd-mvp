const { OAuth2Client } = require('google-auth-library')
const authService = require('~/services/auth')
const { getUserByEmail, createUser, privateUpdateUser } = require('~/services/user')
const crypto = require('crypto')
const { gmailCredentials } = require('~/configs/config')
const client = new OAuth2Client(gmailCredentials.clientId)

const googleAuthService = {
  verifyToken: async (token) => {
    // verify Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: gmailCredentials.clientId
    })
    return ticket.getPayload() // return email, name, picture...
  },

    
 //----------------------------------------   

  loginOrSignup: async (token, role, language) => {
    const payload = await googleAuthService.verifyToken(token)
    const { email, given_name, family_name } = payload
      
    let user = await getUserByEmail(email)
    
    // if user doesn't exist, create it with random password and mark email as confirmed (because Google already confirmed it)
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex')
      user = await createUser(role, given_name, family_name, email, randomPassword, language)
      await privateUpdateUser(user._id, { isEmailConfirmed: true })
    }

    // return isFromGoogle = true
    return await authService.login(email, null, true)
  }
  

}

module.exports = googleAuthService