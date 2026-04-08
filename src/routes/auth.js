const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const validationMiddleware = require('~/middlewares/validation')
const langMiddleware = require('~/middlewares/appLanguage')

const authController = require('~/controllers/auth')
// ДОДАНО: імпортуємо твій контролер для Google
const { googleLogin } = require('~/controllers/googleAuth')

const signupValidationSchema = require('~/validation/schemas/signup')
const { loginValidationSchema } = require('~/validation/schemas/login')
const resetPasswordValidationSchema = require('~/validation/schemas/resetPassword')
const forgotPasswordValidationSchema = require('~/validation/schemas/forgotPassword')

router.post(
  '/signup',
  validationMiddleware(signupValidationSchema),
  langMiddleware,
  asyncWrapper(authController.signup)
)
router.post('/login', validationMiddleware(loginValidationSchema), asyncWrapper(authController.login))
router.post('/logout', asyncWrapper(authController.logout))
router.get('/refresh', asyncWrapper(authController.refreshAccessToken))
router.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.sendResetPasswordEmail)
)
router.patch(
  '/reset-password/:token',
  validationMiddleware(resetPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.updatePassword)
)
// confirm email route /auth/confirm-email
router.get('/confirm-email/:confirmToken', langMiddleware, asyncWrapper(authController.confirmEmail))

// ДОДАНО: маршрут, який так довго шукав твій фронтенд
router.post('/google-login', langMiddleware, asyncWrapper(googleLogin))

module.exports = router
