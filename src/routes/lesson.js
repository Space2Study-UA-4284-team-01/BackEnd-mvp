const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const lessonController = require('~/controllers/lesson')
const { TUTOR, ADMIN } = require('~/consts/auth').roles

router.use(authMiddleware)

router.use(restrictTo(TUTOR, ADMIN))
router.get('/', asyncWrapper(lessonController.getLessons))
router.post('/', asyncWrapper(lessonController.createLesson))

module.exports = router
