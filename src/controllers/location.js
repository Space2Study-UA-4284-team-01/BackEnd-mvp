const locationService = require('~/services/location')

const getCountries = async (_req, res) => {
  const countries = await locationService.getCountries()
  res.status(200).json(countries)
}

const getCitiesByCountry = async (req, res) => {
  const { countryIso } = req.params
  const cities = await locationService.getCitiesByCountry(countryIso)
  
  res.status(200).json(cities)
}

module.exports = {
  getCountries,
  getCitiesByCountry
}

