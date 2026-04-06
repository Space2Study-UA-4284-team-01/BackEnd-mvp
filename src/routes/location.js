const router = require('express').Router()
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const locationController = require('~/controllers/location')

router.use(authMiddleware)

// all countries with their names and ISO2 codes
router.get('/countries', asyncWrapper(locationController.getCountries))

// all cities for a given country ISO2 code
router.get('/countries/:countryIso/cities', asyncWrapper(locationController.getCitiesByCountry))

module.exports = router