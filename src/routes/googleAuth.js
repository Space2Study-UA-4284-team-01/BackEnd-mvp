const router = require('express').Router()
const googleAuthController = require('~/controllers/googleAuth')
const asyncWrapper = require('~/middlewares/asyncWrapper') 

router.post('/', asyncWrapper(googleAuthController.googleLogin))


module.exports = router