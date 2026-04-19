const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const categoryController = require('~/controllers/category')
const subjectController = require('~/controllers/subject')
const { ADMIN, SUPERADMIN } = require('~/consts/auth').roles

router.use(authMiddleware)

router.get('/', asyncWrapper(categoryController.getCategories))
router.get('/names', asyncWrapper(categoryController.getCategoriesNames))
router.get('/:id', asyncWrapper(categoryController.getCategoryById))
router.get('/:id/subjects/names', asyncWrapper(subjectController.getSubjectNamesByCategoryId))

router.use(restrictTo(ADMIN, SUPERADMIN))
router.post('/', asyncWrapper(categoryController.createCategory))

module.exports = router
