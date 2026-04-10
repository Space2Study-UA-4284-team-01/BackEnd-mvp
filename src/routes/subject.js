const router = require('express').Router()
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const subjectController = require('~/controllers/subject')
const { ADMIN, SUPERADMIN } = require('~/consts/auth').roles

router.use(authMiddleware)
router.use(restrictTo(ADMIN, SUPERADMIN))

router.post('/', asyncWrapper(subjectController.createSubject))

module.exports = router
