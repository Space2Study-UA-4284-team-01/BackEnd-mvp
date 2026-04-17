const {
  config: { CSC_API_KEY, CSC_API_URL = 'https://api.countrystatecity.in/v1' }
} = require('~/configs/config')
const { createError } = require('~/utils/errorsHelper')
// eslint-disable-next-line no-unused-vars
const { EXTERNAL_SERVICE_ERROR, NOT_FOUND } = require('~/consts/errors')
const mockData = require('~/utils/mocks/locationData')

const isMockEnabled = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

const headers = {
  'X-CSCAPI-KEY': CSC_API_KEY,
  'Content-Type': 'application/json'
}

const locationService = {
  getCountries: async () => {
    if (isMockEnabled) {
      return mockData.countries
    }

    const response = await fetch(`${CSC_API_URL}/countries`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw createError(502, EXTERNAL_SERVICE_ERROR)
    }

    const data = await response.json()

    return data.map(({ name, iso2 }) => ({
      name,
      iso2
    }))
  },

  getCitiesByCountry: async (countryIso) => {
    if (!countryIso) {
      return []
    }

    if (isMockEnabled) {
      const states = mockData.statesByCountry[countryIso] || []

      const cities = states.flatMap(state => 
        mockData.citiesByState[state.iso2] || []
      )

      return cities.map(({ name }) => ({ name })).sort((a, b) => a.name.localeCompare(b.name)) 
    }


    const statesResponse = await fetch(`${CSC_API_URL}/countries/${countryIso}/states`, {
      method: 'GET',
      headers
    })

    if (!statesResponse.ok) {
      if (statesResponse.status === 404) return []
      throw createError(502, EXTERNAL_SERVICE_ERROR)
    }

    const states = await statesResponse.json()

    if (!states.length) {
      return []
    }

    const citiesPromises = states.map(async (state) => {
      try {
        const res = await fetch(`${CSC_API_URL}/countries/${countryIso}/states/${state.iso2}/cities`, {
          method: 'GET',
          headers
        })

        if (!res.ok) {
          console.error(`Failed to fetch cities for state ${state.iso2}: ${res.statusText}`)
          return []
        }

        const cities = await res.json()
        // we only need the name field for each city
        return cities.map(({ name }) => ({ name }))
      } catch (error) {
        console.error(`Unexpected error fetching cities for state ${state.iso2}:`, error.message)
        return []
      }
    })

    const citiesArrays = await Promise.all(citiesPromises)
    const allCities = citiesArrays.flat()

    return allCities.sort((a, b) => a.name.localeCompare(b.name)) 
  }
}

module.exports = locationService
