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
  USER_NOT_FOUND,
  ALREADY_REGISTERED
} = require('~/consts/errors')
const emailSubject = require('~/consts/emailSubject')

// Імпортуємо назви токенів та SALT_ROUNDS з констант
const {
  tokenNames: { REFRESH_TOKEN, RESET_TOKEN, CONFIRM_TOKEN },
  SALT_ROUNDS: AUTH_SALT_ROUNDS
} = require('~/consts/auth')

const bcrypt = require('bcrypt')

// Визначаємо SALT_ROUNDS: пріоритет константі з файлу, інакше 10
const SALT_ROUNDS = AUTH_SALT_ROUNDS || 10

const authService = {
  signup: async (role, firstName, lastName, email, password, language) => {
    // 1. Перевіряємо, чи такий email вже існує
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw createError(409, ALREADY_REGISTERED)
    }

    // 2. Створюємо нового користувача
    const user = await createUser(role, firstName, lastName, email, password, language)

    // 3. Генеруємо та зберігаємо токен підтвердження
    const confirmToken = tokenService.generateConfirmToken({ id: user._id, role })
    await tokenService.saveToken(user._id, confirmToken, CONFIRM_TOKEN)

    // 4. Відправляємо лист (з детальним логуванням помилок)
    try {
      await emailService.sendEmail(email, emailSubject.EMAIL_CONFIRMATION, language, { confirmToken, email, firstName })
      console.log(`[EmailService] Confirmation email sent to ${email}`)
    } catch (e) {
      console.error('--- EMAIL SENDING FAILED ---')
      console.error('Error details:', e)
      console.error('---------------------------')
    }

    return {
      userId: user._id,
      userEmail: user.email
    }
  },

  confirmEmail: async (confirmToken) => {
    console.log('\n--- 🚀 ПОЧАТОК ПІДТВЕРДЖЕННЯ ПОШТИ ---')
    console.log('1. Токен, який прийшов:', confirmToken)

    const tokenData = tokenService.validateConfirmToken(confirmToken)
    console.log('2. Розшифровані дані токена:', tokenData)

    const tokenFromDB = await tokenService.findToken(confirmToken, CONFIRM_TOKEN)
    console.log('3. Чи знайдено токен у базі?', !!tokenFromDB)

    if (!tokenData || !tokenFromDB) {
      console.log('❌ ПОМИЛКА: Токен недійсний або його немає в базі')
      throw createError(400, BAD_CONFIRM_TOKEN)
    }

    console.log('4. Оновлюємо статус юзера з ID:', tokenData.id)

    // Викликаємо оновлення
    const result = await privateUpdateUser(tokenData.id, { isEmailConfirmed: true })
    console.log('5. Результат оновлення бази:', result)

    await tokenService.saveToken(tokenData.id, null, CONFIRM_TOKEN)
    console.log('✅ УСПІХ: Пошту підтверджено, токен видалено!')
    console.log('--------------------------------------\n')
  },

  login: async (email, password, isFromGoogle) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(401, USER_NOT_FOUND)
    }

    let checkedPassword = isFromGoogle

    if (!isFromGoogle) {
      // Перевіряємо, чи пароль у БД вже захешований (формат bcrypt)
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
        // Якщо пароль ще не захешований (стара версія), порівнюємо напряму
        checkedPassword = password === user.password

        if (checkedPassword) {
          // Хешуємо його для безпеки на майбутнє
          const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
          await privateUpdateUser(user._id, { password: hashedPassword })
        }
      }
    }

    if (!checkedPassword) {
      throw createError(401, INCORRECT_CREDENTIALS)
    }

    const { _id, lastLoginAs, isFirstLogin, isEmailConfirmed } = user

    // Перевірка підтвердження пошти
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
    // Хешуємо новий пароль перед збереженням
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    await privateUpdateUser(userId, { password: hashedPassword })

    await tokenService.removeResetToken(userId)

    await emailService.sendEmail(email, emailSubject.SUCCESSFUL_PASSWORD_RESET, language, {
      firstName
    })
  }
}

module.exports = authService
