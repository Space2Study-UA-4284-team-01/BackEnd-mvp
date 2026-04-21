const Subject = require('~/models/subject')
const Category = require('~/models/category')
const subjectsData = require('~/seed/data/subjectsData')
const logger = require('~/logger/logger')

const seedSubjects = async () => {
  try {
    let subjectCount = 0

    for (const [categoryName, subjects] of Object.entries(subjectsData)) {
      let category = await Category.findOne({ name: categoryName })

      if (!category) {
        logger.warn(`Category "${categoryName}" not found. Skipping subjects in this category.`)
        continue
      }

      for (const subjectName of subjects) {
        const normalizedSubjectName = subjectName.trim()

        const result = await Subject.updateOne(
          { name: normalizedSubjectName },
          {
            $setOnInsert: { name: normalizedSubjectName, category: category._id, totalOffers: { student: 0, tutor: 0 } }
          },
          { upsert: true }
        )

        if (result.upserted) {
          subjectCount++
        }
      }
    }

    logger.info(`Seeding completed. Total subjects added: ${subjectCount}`)
  } catch (err) {
    logger.error('Error seeding subjects:', err)
  }
}

module.exports = seedSubjects
