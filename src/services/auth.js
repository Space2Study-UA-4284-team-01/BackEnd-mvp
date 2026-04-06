const tokenService = require('~/services/token')
const emailService = require('~/services/email')
const { getUserByEmail, createUser, privateUpdateUser, getUserById } = require('~/services/user')
const { createError } = require('~/utils/errorsHelper')
const {
  EMAIL_NOT_CONFIRMED,
  INCORRECT_CREDENTIALS,
  INTERNAL_SERVER_ERROR,
  BAD_RESET_TOKEN,
  BAD_CONFIRM_TOKEN, 
  BAD_REFRESH_TOKEN,
  USER_NOT_FOUND
} = require('~/consts/errors')
const emailSubject = require('~/consts/emailSubject')
const {
  tokenNames: { REFRESH_TOKEN, RESET_TOKEN, CONFIRM_TOKEN }
} = require('~/consts/auth')
const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = require('~/consts/auth')

const authService = {
  signup: async (role, firstName, lastName, email, password, language) => {
    const user = await createUser(role, firstName, lastName, email, password, language)

    const confirmToken = tokenService.generateConfirmToken({ id: user._id, role })
    await tokenService.saveToken(user._id, confirmToken, CONFIRM_TOKEN)
    await emailService.sendEmail(email, emailSubject.EMAIL_CONFIRMATION, language, { confirmToken, email, firstName })
    return {
      userId: user._id,
      userEmail: user.email
    }
  },

  confirmEmail: async (confirmToken) => {
    const tokenData = tokenService.validateConfirmToken(confirmToken)
    const tokenFromDB = await tokenService.findToken(confirmToken, CONFIRM_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_CONFIRM_TOKEN)
    }

    await privateUpdateUser(tokenData.id, { isEmailConfirmed: true })
    await tokenService.saveToken(tokenData.id, null, CONFIRM_TOKEN) 
  },

  login: async (email, password, isFromGoogle) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(401, USER_NOT_FOUND)
    }

    // compare through bcrypt if not from Google
    //const checkedPassword = isFromGoogle || await bcrypt.compare(password, user.password)

    let checkedPassword = isFromGoogle

    if (!isFromGoogle) {
      // check if the password in DB is hashed (bcrypt format)
      const bcryptHashRegex = /^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/
      const isHashed = bcryptHashRegex.test(user.password)

      if (isHashed) {
        try {
          checkedPassword = await bcrypt.compare(password, user.password)
        } catch (error) {
          console.error('Bcrypt unexpected error:', error.message)
          throw createError(500, INTERNAL_SERVER_ERROR)
        }
      } else {
        // if password is not hashed, compare directly and then hash it for future logins
        checkedPassword = (password === user.password)

        if (checkedPassword) {
          // hashing
          const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
          await privateUpdateUser(user._id, { password: hashedPassword })
        }
      }
    }
    

    if (!checkedPassword) {
      throw createError(401, INCORRECT_CREDENTIALS)
    }

    const { _id, lastLoginAs, isFirstLogin, isEmailConfirmed } = user

    if (!isEmailConfirmed) {
      throw createError(401, EMAIL_NOT_CONFIRMED)
    }

    const tokens = tokenService.generateTokens({ id: _id, role: lastLoginAs, isFirstLogin })
    await tokenService.saveToken(_id, tokens.refreshToken, REFRESH_TOKEN)

    if (isFirstLogin) {
      await privateUpdateUser(_id, { isFirstLogin: false })
    }

    await privateUpdateUser(_id, { lastLogin: new Date() })

    return tokens
  },

  logout: async (refreshToken) => {
    await tokenService.removeRefreshToken(refreshToken)
  },

  refreshAccessToken: async (refreshToken) => {
    const tokenData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken, REFRESH_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_REFRESH_TOKEN)
    }

    const { _id, lastLoginAs, isFirstLogin } = await getUserById(tokenData.id)

    const tokens = tokenService.generateTokens({ id: _id, role: lastLoginAs, isFirstLogin })
    await tokenService.saveToken(_id, tokens.refreshToken, REFRESH_TOKEN)

    return tokens
  },

  sendResetPasswordEmail: async (email, language) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(404, USER_NOT_FOUND)
    }

    const { _id, firstName } = user

    const resetToken = tokenService.generateResetToken({ id: _id, firstName, email })
    await tokenService.saveToken(_id, resetToken, RESET_TOKEN)

    await emailService.sendEmail(email, emailSubject.RESET_PASSWORD, language, { resetToken, email, firstName })
  },

  updatePassword: async (resetToken, password, language) => {
    const tokenData = tokenService.validateResetToken(resetToken)
    const tokenFromDB = await tokenService.findToken(resetToken, RESET_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_RESET_TOKEN)
    }

    const { id: userId, firstName, email } = tokenData
    // hash the new password before saving
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    await privateUpdateUser(userId, { password: hashedPassword })

    await tokenService.removeResetToken(userId)

    await emailService.sendEmail(email, emailSubject.SUCCESSFUL_PASSWORD_RESET, language, {
      firstName
    })
  }
}

module.exports = authService
