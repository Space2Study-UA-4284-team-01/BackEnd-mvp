const googleAuthService = require('~/services/googleAuth')
const { config } = require('~/configs/config')

const googleLogin = async (req, res) => {
  // pull token and role from request body
  const token = req.body?.token?.credential
  const role = req.body?.role
  const lang = req.lang || 'en'

  if (typeof token !== 'string' || !token) {
    return res.status(400).json({ error: 'Invalid or missing token credential' })
  }

  // pass token and role to service layer to handle login/signup logic
  const tokens = await googleAuthService.loginOrSignup(token, role, lang)

  // create access and refresh token cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none', // cross domain for Google
    domain: config.COOKIE_DOMAIN
  }

  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
  res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })

  // send access token in response
  res.status(200).json({
    accessToken: tokens.accessToken
  })
}

module.exports = {
  googleLogin
}
