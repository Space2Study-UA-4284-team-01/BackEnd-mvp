const { OAuth2Client } = require('google-auth-library')
const authService = require('~/services/auth')
const { getUserByEmail, createUser, privateUpdateUser } = require('~/services/user')
const crypto = require('crypto')

const client = new OAuth2Client(process.env.GMAIL_CLIENT_ID)

const googleAuthService = {
  verifyToken: async (token) => {
    // verify Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GMAIL_CLIENT_ID
    })
    return ticket.getPayload() // return email, name, picture?
  },

    
 //----------------------------------------   

  loginOrSignup: async (token, role, language) => {
    const payload = await googleAuthService.verifyToken(token)
    const { email, given_name, family_name } = payload

    console.log('Google token payload:', payload) // log the payload for debugging
      
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