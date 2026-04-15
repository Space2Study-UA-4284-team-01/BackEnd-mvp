const Subject = require('~/models/subject')
const seedSubjects = require('~/seed/seedSubjects')
const subjectsData = require('~/seed/data/subjectsData')
const logger = require('~/logger/logger')

const getExpectedSubjectsCount = () => Object.values(subjectsData).flat().length

const checkSubjectsExistence = async () => {
  try {
    const count = await Subject.countDocuments()
    const expectedCount = getExpectedSubjectsCount()

    if (count < expectedCount) {
      logger.info(`Seeding subjects... (${count}/${expectedCount})`)
      await seedSubjects()
    } else {
      logger.info('All subjects already exist, skipping seed.')
    }
  } catch (err) {
    logger.error('Error checking subjects existence:', err)
  }
}

module.exports = checkSubjectsExistence
