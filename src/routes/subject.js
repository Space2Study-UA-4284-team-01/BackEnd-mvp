const router = require('express').Router()
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const subjectController = require('~/controllers/subject')
const { ADMIN, SUPERADMIN } = require('~/consts/auth').roles

router.use(authMiddleware)

router.get('/', asyncWrapper(subjectController.getSubjects))
router.get('/:id', asyncWrapper(subjectController.getSubjectById))

router.use(restrictTo(ADMIN, SUPERADMIN))

router.post('/', asyncWrapper(subjectController.createSubject))
router.patch('/:id', asyncWrapper(subjectController.updateSubject))
router.delete('/:id', asyncWrapper(subjectController.deleteSubject))

module.exports = router
