
process.env.NODE_ENV = 'production'

const locationService = require('~/services/location')

describe('Location Service Unit Tests', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getCountries', () => {
    it('should return a list of countries with only name and iso2 fields', async () => {
      const mockApiCountries = [
        { name: 'Ukraine', iso2: 'UA', phone_code: '380', id: 1 },
        { name: 'Poland', iso2: 'PL', phone_code: '48', id: 2 }
      ]

      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiCountries
      })

      const result = await locationService.getCountries()

      expect(result).toEqual([
        { name: 'Ukraine', iso2: 'UA' },
        { name: 'Poland', iso2: 'PL' }
      ])
      expect(result[0]).not.toHaveProperty('phone_code')
    })
  })

  describe('getCitiesByCountry', () => {
    const countryIso = 'UA'

    it('should fetch states and combine all cities into one sorted list', async () => {
      // 1. mock the response for states of the country
      const mockStates = [
        { name: 'Kyiv Oblast', iso2: '30' },
        { name: 'Lviv Oblast', iso2: '46' }
      ]
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStates
      })

      // 2. mock the responses for cities of each state
      // cities for Kyiv Oblast
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'Kyiv' }, { name: 'Boryspil' }]
      })
      // cities for Lviv Oblast
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'Lviv' }]
      })

      const result = await locationService.getCitiesByCountry(countryIso)

      // is the result a combined list of cities from both states?
      // is it sorted alphabetically by city name?
      expect(result).toEqual([{ name: 'Boryspil' }, { name: 'Kyiv' }, { name: 'Lviv' }])

      // check that 3 fetch calls were made: 1 for states + 2 for cities
      expect(globalThis.fetch).toHaveBeenCalledTimes(3)
    })

    it('should return an empty array if the country has no states', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      const result = await locationService.getCitiesByCountry('SOME_ISO')

      expect(result).toEqual([])
      expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    })

    it('should not fail if one of the state-to-cities requests fails (403/404)', async () => {
      // mock the response for states of the country
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ iso2: 'ST1' }, { iso2: 'ST2' }]
      })

      // first cities request is successful, second one fails with 403 or 404
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'City 1' }]
      })
      // second request fails
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden'
      })

      const result = await locationService.getCitiesByCountry('UA')

      // if one request fails, we should still get cities from the successful request
      expect(result).toEqual([{ name: 'City 1' }])
    })
  })
})
