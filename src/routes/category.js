const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const categoryController = require('~/controllers/category')
const { ADMIN, SUPERADMIN } = require('~/consts/auth').roles

router.use(authMiddleware)
router.use(restrictTo(ADMIN, SUPERADMIN))

router.post('/', asyncWrapper(categoryController.createCategory))

module.exports = router
