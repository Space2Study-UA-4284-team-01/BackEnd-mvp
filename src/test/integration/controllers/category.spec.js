const { expectError } = require('~/test/helpers')
const {
  UNAUTHORIZED,
  FORBIDDEN,
  FIELD_IS_NOT_DEFINED,
  FIELD_IS_NOT_OF_PROPER_LENGTH,
  FIELD_ALREADY_EXISTS
} = require('~/consts/errors')
const setupControllerTests = require('~/test/helpers/controllerSetup')

const endpointUrl = '/categories/'

const testCategoryData = {
  name: 'Test Category',
  appearance: {
    icon: 'math-icon.png',
    color: '#FF0000'
  }
}

describe('Category controller', () => {
  // Get the app instance and tokens from the setup function
  const { getApp, getTokens } = setupControllerTests()
  let app, token

  beforeEach(async () => {
    app = getApp()
    token = getTokens()
  })

  describe('POST /categories/', () => {
    it('should create a new category successfully for admin user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body).toMatchObject({
        name: testCategoryData.name,
        appearance: testCategoryData.appearance
      })
    })

    it('should return 409 when trying to create category with existing name', async () => {
      // 1. FIRST REQUEST: Create a category (should succeed with 201)
      const firstResponse = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(firstResponse.statusCode).toBe(201)

      // 2. SECOND REQUEST: Try to create the same category (should return 409)
      const secondResponse = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(409, FIELD_ALREADY_EXISTS('name'), secondResponse)
    })

    it('should return 403 for student user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 403 for tutor user', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app.post(endpointUrl).send(testCategoryData)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should return 422 for invalid data - missing name', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ appearance: testCategoryData.appearance })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_DEFINED('name'), response)
    })

    it('should return 422 for invalid data - name too long', async () => {
      const invalidData = {
        name: 'A'.repeat(31),
        appearance: testCategoryData.appearance
      }

      const response = await app
        .post(endpointUrl)
        .send(invalidData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expectError(422, FIELD_IS_NOT_OF_PROPER_LENGTH('name', { min: 1, max: 30 }), response)
    })

    it('should NOT return 422 for missing appearance because of defaults in schema', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'Brand New Category' })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(201)
      expect(response._body.name).toBe('Brand New Category')
      expect(response._body.appearance).toHaveProperty('icon')
      expect(response._body.appearance).toHaveProperty('color')
    })
  })

  describe('GET /categories/', () => {
    beforeEach(async () => {
      await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      await app
        .post(endpointUrl)
        .send({
          name: 'Physics',
          appearance: {
            icon: 'physics-icon.png',
            color: '#00FF00'
          }
        })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      await app
        .post(endpointUrl)
        .send({
          name: 'Chemistry',
          appearance: {
            icon: 'chemistry-icon.png',
            color: '#0000FF'
          }
        })
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      // Create subjects for categories to make them visible in GET request
      const Category = require('~/models/category')

      const mathCategory = await Category.findOne({ name: 'Test Category' })
      const physicsCategory = await Category.findOne({ name: 'Physics' })

      if (mathCategory) {
        // Insert subject directly into database collection
        await Category.db.collection('subjects').insertOne({
          name: 'Algebra',
          category: mathCategory._id,
          description: 'Basic algebra course'
        })
      }

      if (physicsCategory) {
        await Category.db.collection('subjects').insertOne({
          name: 'Mechanics',
          category: physicsCategory._id,
          description: 'Classical mechanics'
        })
      }
    })

    it('should return categories successfully for authenticated user', async () => {
      const response = await app.get(endpointUrl).set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response._body).toHaveProperty('items')
      expect(response._body).toHaveProperty('count')
      expect(Array.isArray(response._body.items)).toBe(true)
      expect(typeof response._body.count).toBe('number')
    })

    it('should return categories with correct structure', async () => {
      const response = await app.get(endpointUrl).set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response._body.items.length).toBeGreaterThan(0)

      const firstCategory = response._body.items[0]
      expect(firstCategory).toHaveProperty('_id')
      expect(firstCategory).toHaveProperty('name')
      expect(firstCategory).toHaveProperty('appearance')
      expect(firstCategory.appearance).toHaveProperty('icon')
      expect(firstCategory.appearance).toHaveProperty('color')
      expect(firstCategory).toHaveProperty('totalOffers')
      expect(firstCategory.totalOffers).toHaveProperty('student')
      expect(firstCategory.totalOffers).toHaveProperty('tutor')
      expect(firstCategory).toHaveProperty('createdAt')
      expect(firstCategory).toHaveProperty('updatedAt')
    })

    it('should filter categories by name', async () => {
      const response = await app
        .get(`${endpointUrl}?name=test`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response._body.items.length).toBeGreaterThan(0)
      response._body.items.forEach((category) => {
        expect(category.name.toLowerCase()).toContain('test')
      })
    })

    it('should support pagination with limit parameter', async () => {
      const response = await app
        .get(`${endpointUrl}?limit=2`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response._body.items.length).toBeLessThanOrEqual(2)
    })

    it('should support pagination with skip parameter', async () => {
      const firstResponse = await app
        .get(`${endpointUrl}?limit=1&skip=0`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      const secondResponse = await app
        .get(`${endpointUrl}?limit=1&skip=1`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])
      expect(firstResponse.statusCode).toBe(200)
      expect(secondResponse.statusCode).toBe(200)
      expect(firstResponse._body.items.length).toBe(1)
      expect(secondResponse._body.items.length).toBe(1)

      // Items should be different
      expect(firstResponse._body.items[0]._id).not.toBe(secondResponse._body.items[0]._id)
    })

    it('should return 401 for unauthenticated request', async () => {
      const response = await app.get(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should handle invalid limit parameter gracefully', async () => {
      const response = await app
        .get(`${endpointUrl}?limit=invalid`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(422)
    })

    it('should handle invalid skip parameter gracefully', async () => {
      const response = await app
        .get(`${endpointUrl}?skip=invalid`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(422)
    })

    it('should return empty result for non-matching name filter', async () => {
      const response = await app
        .get(`${endpointUrl}?name=nonexistentcategory`)
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response._body.items).toEqual([])
      expect(response._body.count).toBe(0)
    })
  })

  describe('GET /categories/names', () => {
    it('should return categories names for authenticated user', async () => {
      // 1. create category first
      await app
        .post(endpointUrl)
        .send(testCategoryData)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      // 2. get names
      const response = await app
        .get('/categories/names')
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response.body.data).toEqual(
        expect.arrayContaining([testCategoryData.name])
      )
    })

    it('should return empty array when no categories exist', async () => {
      const response = await app
        .get('/categories/names')
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response.body.data).toEqual([])
    })

    it('should return 401 for unauthenticated user', async () => {
      const response = await app
        .get('/categories/names')

      expectError(401, UNAUTHORIZED, response)
    })

    it('should allow all authenticated roles to access names', async () => {
      const adminRes = await app
        .get('/categories/names')
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      const studentRes = await app
        .get('/categories/names')
        .set('Cookie', [`accessToken=${token.studentAccessToken}`])
      const tutorRes = await app
        .get('/categories/names')
        .set('Cookie', [`accessToken=${token.tutorAccessToken}`])

      expect(adminRes.statusCode).toBe(200)
      expect(studentRes.statusCode).toBe(200)
      expect(tutorRes.statusCode).toBe(200)
    })
  })

  describe('GET /categories/:id', () => {
    let categoryId

    beforeEach(async () => {
      const category = await Category.create(testCategoryData)
      categoryId = category._id.toString()
    })

    it('should return 200 and category details for valid ID', async () => {
      const response = await app
        .get(`${endpointUrl}${categoryId}`)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(response._body._id).toBe(categoryId)
    })

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '60f72360f044231f8e2b2605' // valid ObjectId format but does not exist in DB
      const response = await app
        .get(`${endpointUrl}${fakeId}`)
        .set('Cookie', [`accessToken=${token.adminAccessToken}`])

      expect(response.statusCode).toBe(404)
    })
  })

})
