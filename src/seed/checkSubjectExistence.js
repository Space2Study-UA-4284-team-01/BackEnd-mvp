const seedSubjects = require('~/seed/seedSubjects')
const logger = require('~/logger/logger')

const checkSubjectsExistence = async () => {
  try {
    await seedSubjects()
    logger.info('Subjects ensured (idempotent)')
  } catch (err) {
    logger.error('Error ensuring subjects:', err)
  }
}

module.exports = checkSubjectsExistence
