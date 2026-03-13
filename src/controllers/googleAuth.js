
const googleAuthService = require('~/services/googleAuth')

const googleLogin = async (req, res) => {
   
  // pull token and role from request body
  const token = req.body.token.credential  
  const role = req.body.role
  const lang = req.lang || 'en' 

  // pass token and role to service layer to handle login/signup logic
  const tokens = await googleAuthService.loginOrSignup(token, role, lang)

  // create refresh token cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: req.hostname !== 'localhost' // only set secure flag in production?
  })

  // send access token and user info in response
    res.status(200).json({
    accessToken: tokens.accessToken,
    userId: tokens.userId 
      })

}

module.exports = {
  googleLogin
}