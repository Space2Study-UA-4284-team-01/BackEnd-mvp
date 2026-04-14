const Subject = require('~/models/subject')
const seedSubjects = require('~/seed/seedSubjects')
const logger = require('~/logger/logger')

const checkSubjectsExistence = async () => {
  try {
    const count = await Subject.countDocuments()

    if (count === 0) {
      await seedSubjects()
    } else {
      logger.info('Subjects already exist, skipping seed.')
    }
  } catch (err) {
    logger.error('Error checking subjects existence:', err)
  }
}

module.exports = checkSubjectsExistence
